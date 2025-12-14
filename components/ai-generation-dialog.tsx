"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Sparkles, User, MessageSquare, Hash, Lightbulb } from "lucide-react"

interface AiGenerationDialogProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (generatedText: string) => void
}

interface Personality {
  id: string
  name: string
  prompt: string
  tags: string[]
  profileImageUrl?: string
}

export function AiGenerationDialog({ isOpen, onClose, onGenerate }: AiGenerationDialogProps) {
  const [personalities, setPersonalities] = useState<Personality[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    requirements: "",
    personalityId: ""
  })

  useEffect(() => {
    if (isOpen) {
      fetchPersonalities()
    }
  }, [isOpen])

  const fetchPersonalities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/personalities')
      if (response.ok) {
        const data = await response.json()
        setPersonalities(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching personalities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic for the post')
      return
    }

    if (!formData.personalityId) {
      alert('Please select a personality')
      return
    }

    try {
      setGenerating(true)
      
      const selectedPersonality = personalities.find(p => p.id === formData.personalityId)
      if (!selectedPersonality) {
        throw new Error('Selected personality not found')
      }

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: formData.topic,
          requirements: formData.requirements,
          personality: selectedPersonality
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()
      onGenerate(data.generatedText)
      onClose()
      
      // Reset form
      setFormData({
        topic: "",
        requirements: "",
        personalityId: ""
      })
    } catch (error) {
      console.error('Error generating post:', error)
      alert('Failed to generate post. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleClose = () => {
    setFormData({
      topic: "",
      requirements: "",
      personalityId: ""
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#64FFDA]" />
              <h2 className="text-xl font-semibold text-[#E0E0E0]">Generate Post with AI</h2>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                placeholder="What should this post be about? (e.g., AI trends, web development, productivity tips)"
                required
              />
              <div className="text-xs text-[#E0E0E0]/50 mt-1">
                Enter the main topic or theme for your post
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                <Lightbulb className="inline h-4 w-4 mr-1" />
                Requirements (optional)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA] h-24 resize-none"
                placeholder="Any specific requirements, tone, or points to include? (e.g., 'Make it humorous', 'Include statistics', 'Keep it professional')"
              />
              <div className="text-xs text-[#E0E0E0]/50 mt-1">
                Add any specific instructions for the AI to follow
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Personality
              </label>
              {loading ? (
                <div className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0]/50">
                  Loading personalities...
                </div>
              ) : (
                <select
                  value={formData.personalityId}
                  onChange={(e) => setFormData({ ...formData, personalityId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                  required
                >
                  <option value="">Select a personality</option>
                  {personalities.map((personality) => (
                    <option key={personality.id} value={personality.id}>
                      {personality.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="text-xs text-[#E0E0E0]/50 mt-1">
                Choose which AI personality should generate this post
              </div>
            </div>

            {formData.personalityId && (
              <Card className="p-4 bg-[#1a1a1a] border-white/10">
                <div className="flex items-start space-x-3">
                  {personalities.find(p => p.id === formData.personalityId)?.profileImageUrl ? (
                    <img
                      src={personalities.find(p => p.id === formData.personalityId)?.profileImageUrl}
                      alt="Personality avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#64FFDA]/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-[#64FFDA]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#E0E0E0] mb-1">
                      {personalities.find(p => p.id === formData.personalityId)?.name}
                    </h4>
                    <p className="text-xs text-[#E0E0E0]/60 line-clamp-2">
                      {personalities.find(p => p.id === formData.personalityId)?.prompt}
                    </p>
                    {personalities.find(p => p.id === formData.personalityId)?.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {personalities.find(p => p.id === formData.personalityId)?.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-[#64FFDA]/10 text-[#64FFDA] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={generating || !formData.topic.trim() || !formData.personalityId}
                className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90 w-full"
              >
                {generating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
