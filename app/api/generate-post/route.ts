import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, requirements, personality, model = 'gemini-2.5-flash' } = body

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
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate post'
    const isOverloadError = errorMessage.includes('overloaded') || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        fallbackAttempted: isOverloadError
      },
      { status: 500 }
    )
  }
}
