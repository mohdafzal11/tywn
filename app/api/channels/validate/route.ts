import { NextRequest, NextResponse } from "next/server";
import { TwitterService } from "@/lib/twitter-service";

export async function POST(req: NextRequest) {
  try {
    // Note: We don't require authentication for this endpoint
    // since it's just testing if the provided credentials are valid
    // The credentials themselves are the authentication
    
    const { type, credentials } = await req.json();

    // Validate input
    if (!type || !credentials) {
      return NextResponse.json({ 
        error: "Type and credentials are required" 
      }, { status: 400 });
    }

    // Validate based on channel type
    if (type === 'twitter') {
      const { apiKey, apiSecret, accessToken, accessTokenSecret } = credentials;

      // Check if all required fields are present
      if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
        return NextResponse.json({
          valid: false,
          error: "All Twitter API credentials are required"
        }, { status: 400 });
      }

      // Validate credentials with Twitter API
      const validationResult = await TwitterService.validateCredentials({
        apiKey,
        apiSecret,
        accessToken,
        accessTokenSecret
      });

      if (validationResult.valid) {
        return NextResponse.json({
          valid: true,
          message: "Credentials are valid",
          userInfo: validationResult.userInfo
        });
      } else {
        return NextResponse.json({
          valid: false,
          error: validationResult.error || "Invalid credentials"
        }, { status: 400 });
      }
    } else if (type === 'linkedin') {
      // Future implementation for LinkedIn
      return NextResponse.json({
        valid: false,
        error: "LinkedIn validation not yet implemented"
      }, { status: 501 });
    } else {
      return NextResponse.json({
        valid: false,
        error: "Unsupported channel type"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to validate credentials:", error);
    return NextResponse.json({ 
      valid: false,
      error: "Failed to validate credentials",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

