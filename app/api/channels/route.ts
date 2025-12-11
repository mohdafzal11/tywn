import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ExtendedChannel = {
  id: string;
  userId: string;
  type: string;
  name: string;
  isActive: boolean;
  keys: any;
  configuration?: any;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(req: NextRequest) {
  try {
    const userCookie = req.cookies.get("x_user");
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    
    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
      include: {
        channels: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert date strings back to Date objects
    const channels = (dbUser.channels as ExtendedChannel[]).map(channel => {
      const channelData = channel as ExtendedChannel;
      if (channelData.configuration) {
        const config = { ...channelData.configuration };
        if (config.startDate) {
          config.startDate = new Date(config.startDate as string);
        }
        if (config.endDate) {
          config.endDate = new Date(config.endDate as string);
        }
        channelData.configuration = config;
      }
      return channelData;
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.error("Failed to fetch channels:", error);
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user from cookies
    const userCookie = req.cookies.get("x_user");
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const { type, name, settings, configuration } = await req.json();

    // Validate input
    if (!type || !name) {
      return NextResponse.json({ error: "Type and name are required" }, { status: 400 });
    }

    if (!['twitter', 'linkedin'].includes(type)) {
      return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new channel
    const channel = await prisma.channel.create({
      data: {
        userId: dbUser.id,
        type,
        name,
        isActive: true,
        keys: settings || {},
        configuration: configuration || {}
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error("Failed to create channel:", error);
    return NextResponse.json({ 
      error: "Failed to create channel",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get user from cookies
    const userCookie = req.cookies.get("x_user");
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const { channelId, settings, configuration } = await req.json();

    // Validate input
    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify channel belongs to user
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        userId: dbUser.id
      }
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Update channel settings and configuration
    const updateData: any = {};
    if (settings) updateData.keys = settings;
    if (configuration) {
      // Convert Date objects to ISO strings for JSON serialization
      const serializedConfig = { ...configuration };
      if (serializedConfig.startDate) {
        serializedConfig.startDate = serializedConfig.startDate.toISOString();
      }
      if (serializedConfig.endDate) {
        serializedConfig.endDate = serializedConfig.endDate.toISOString();
      }
      updateData.configuration = serializedConfig;
    }

    const updatedChannel = await prisma.channel.update({
      where: { id: channelId },
      data: updateData
    });

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error("Failed to update channel:", error);
    return NextResponse.json({ 
      error: "Failed to update channel",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get user from cookies
    const userCookie = req.cookies.get("x_user");
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('id');

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify channel belongs to user
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        userId: dbUser.id
      }
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Delete channel
    await prisma.channel.delete({
      where: { id: channelId }
    });

    return NextResponse.json({ success: true, message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Failed to delete channel:", error);
    return NextResponse.json({ 
      error: "Failed to delete channel",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
