import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, requirements, personality, model = 'gemini' } = body

    if (!topic || !personality) {
      return NextResponse.json(
        { error: 'Topic and personality are required' },
        { status: 400 }
      )
    }

    const generatedText = await AIService.generatePost(topic, requirements, personality, model)

    return NextResponse.json({ 
      generatedText,
      success: true,
      model: model
    })
  } catch (error) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate post',
        success: false 
      },
      { status: 500 }
    )
  }
}
