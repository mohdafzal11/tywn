import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const personalities = await prisma.personality.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(personalities)
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch personalities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, profileImageUrl, prompt, tags } = body

    if (!name || !prompt) {
      return NextResponse.json(
        { error: 'Name and prompt are required' },
        { status: 400 }
      )
    }

    const personality = await prisma.personality.create({
      data: {
        name,
        profileImageUrl: profileImageUrl || null,
        prompt,
        tags: tags || []
      }
    })

    return NextResponse.json(personality, { status: 201 })
  } catch (error) {
    console.error('Error creating personality:', error)
    return NextResponse.json(
      { error: 'Failed to create personality' },
      { status: 500 }
    )
  }
}
