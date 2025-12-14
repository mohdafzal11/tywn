import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error publishing post:', error)
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    )
  }
}
