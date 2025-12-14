import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const personality = await prisma.personality.findUnique({
      where: { id: params.id }
    })

    if (!personality) {
      return NextResponse.json(
        { error: 'Personality not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(personality)
  } catch (error) {
    console.error('Error fetching personality:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personality' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { name, profileImageUrl, prompt, tags, isActive } = body

    const personality = await prisma.personality.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        ...(prompt && { prompt }),
        ...(tags !== undefined && { tags }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(personality)
  } catch (error) {
    console.error('Error updating personality:', error)
    return NextResponse.json(
      { error: 'Failed to update personality' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'Personality ID is required' },
        { status: 400 }
      )
    }
    
    const existingPersonality = await prisma.personality.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPersonality) {
      return NextResponse.json(
        { error: 'Personality not found' },
        { status: 404 }
      )
    }
    
    const personality = await prisma.personality.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Personality deactivated successfully', personality })
  } catch (error) {
    console.error('Error deactivating personality:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate personality', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
