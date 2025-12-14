import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    let sessionData;
    try {
      sessionData = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    if (!sessionData.userId) {
      return NextResponse.json(
        { error: 'Invalid session format' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        twitterId: true,
        username: true,
        role: true,
        displayName: true,
        profileImageUrl: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
