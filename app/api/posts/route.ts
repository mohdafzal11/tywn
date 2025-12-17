import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const posts = await prisma.post.findMany({
      where: { 
        ...(userId && { userId }),
        status: { not: 'ARCHIVED' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImageUrl: true
          }
        }
      }
    })
    
    const formattedPosts = posts.map(post => ({
      ...post,
      scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
    
    return NextResponse.json(formattedPosts)
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, userId, type, status, scheduledAt, publishedAt } = body

    if (!content || !content.text || !userId || !type) {
      return NextResponse.json(
        { error: 'Content text, userId, and type are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content: content,
        type: type || 'POST',
        status: status || 'DRAFT',
        userId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImageUrl: true
          }
        }
      }
    })

    const formattedPost = {
      ...post,
      scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }

    return NextResponse.json(formattedPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
