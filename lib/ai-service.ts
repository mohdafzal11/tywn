export interface AIModel {
  name: string
  apiKey: string
  endpoint: string
}

export interface Personality {
  id: string
  name: string
  prompt: string
  tags: string[]
  profileImageUrl?: string
}

const AI_MODELS: Record<string, AIModel> = {
  'gemini-2.5-flash': {
    name: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
  },
  'gemini-1.5-flash': {
    name: 'gemini-1.5-flash',
    apiKey: process.env.GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  },
  'gemini-1.5-pro': {
    name: 'gemini-1.5-pro',
    apiKey: process.env.GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
  }
  // Future models can be added here
  // claude: { name: 'claude-3', apiKey: process.env.CLAUDE_API_KEY || '', endpoint: '...' }
}

export class AIService {
  static async generatePost(topic: string, requirements: string, personality: Personality, model: string = 'gemini'): Promise<string> {
    const fallbackModels = this.getFallbackModels(model)
    
    for (const currentModel of fallbackModels) {
      try {
        const result = await this.generatePostWithModel(topic, requirements, personality, currentModel)
        return result
      } catch (error) {
        console.warn(`Failed to generate with ${currentModel}:`, error)
        
        // If this is the last model in the fallback list, throw the error
        if (currentModel === fallbackModels[fallbackModels.length - 1]) {
          throw error
        }
      }
    }
    
    throw new Error('All models failed to generate content')
  }

  private static getFallbackModels(primaryModel: string): string[] {
    const availableModels = this.getAvailableModels()
    
    // Only use Gemini models for fallback
    const geminiModels = availableModels.filter(m => m.startsWith('gemini'))
    
    // Order Gemini models by preference (newer versions first)
    const geminiOrder = ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash']
    const orderedGeminiModels = geminiOrder.filter(m => geminiModels.includes(m))
    
    // Start with the primary model if it's available
    if (availableModels.includes(primaryModel)) {
      const remainingModels = orderedGeminiModels.filter(m => m !== primaryModel)
      return [primaryModel, ...remainingModels]
    }
    
    // If primary model is not available, use available Gemini models in preferred order
    return orderedGeminiModels
  }

  private static async generatePostWithModel(topic: string, requirements: string, personality: Personality, model: string): Promise<string> {
    const aiModel = AI_MODELS[model]
    
    if (!aiModel || !aiModel.apiKey) {
      throw new Error(`AI model ${model} is not configured properly`)
    }

    const prompt = `Generate a Twitter post about "${topic}" based on the following personality:

Personality Name: ${personality.name}
Personality Prompt: ${personality.prompt}
Personality Tags: ${personality.tags?.join(', ') || 'none'}

Additional Requirements: ${requirements || 'none'}

Requirements:
- Generate content that matches the personality's style and tone
- Keep it under 280 characters (Twitter limit)
- Include relevant hashtags
- Make it engaging and authentic to the personality
- Avoid generic content, be specific and interesting

Please generate only the Twitter post content, no additional text or explanations.`

    if (model.startsWith('gemini')) {
      return await AIService.generateWithGemini(prompt, aiModel)
    }
    
    // Future model integrations can be added here
    throw new Error(`Model ${model} is not yet implemented`)
  }

  static async generateWithGemini(prompt: string, model: AIModel): Promise<string> {
    try {
      const response = await fetch(`${model.endpoint}?key=${model.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 280,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let generatedText = data.candidates[0].content.parts[0].text.trim()
        
        // Ensure it's within Twitter character limit
        if (generatedText.length > 280) {
          generatedText = generatedText.substring(0, 277) + "..."
        }
        
        return generatedText
      }
      
      throw new Error('Invalid response format from Gemini API')
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw new Error(`Failed to generate content with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static getAvailableModels(): string[] {
    return Object.keys(AI_MODELS).filter(key => AI_MODELS[key].apiKey)
  }

  static isModelConfigured(model: string): boolean {
    return !!(AI_MODELS[model]?.apiKey)
  }
}
