"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sparkles, User, Wand2 } from "lucide-react"

interface AiGenerationDialogProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (text: string) => void
}

export function AiGenerationDialog({ isOpen, onClose, onGenerate }: AiGenerationDialogProps) {
  const [prompt, setPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [tone, setTone] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState<'input' | 'preview'>('input')

  const tones = ['Professional', 'Casual', 'Humorous', 'Urgent', 'Inspirational']

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const texts = [
        `Here is a ${tone.toLowerCase()} post about ${prompt}. Efficiency is key to success! #productivity #growth`,
        `Just thinking about ${prompt} today. What are your thoughts? let's discuss! 🚀`,
        `Big news! We are excited to announce ${prompt}. Stay tuned for more updates.`,
      ]
      setGeneratedText(texts[Math.floor(Math.random() * texts.length)])
      setIsGenerating(false)
      setStep('preview')
    }, 1500)
  }

  const handleUse = () => {
    onGenerate(generatedText)
    handleClose()
  }

  const handleClose = () => {
    setPrompt("")
    setGeneratedText("")
    setStep('input')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Post with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want to post about, and let AI handle the rest.
          </DialogDescription>
        </DialogHeader>

        {step === 'input' ? (
          <form onSubmit={handleGenerate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Topic or Idea</Label>
              <Textarea
                placeholder="e.g. Announcing our new feature launch..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-24 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tone of Voice</Label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <Badge
                    key={t}
                    variant={tone === t.toLowerCase() ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTone(t.toLowerCase())}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={!prompt || isGenerating}>
                {isGenerating ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Generated Draft</Label>
              <Card className="p-4 bg-muted/50">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" /> {/* Mock User */}
                    <p className="text-sm leading-relaxed">{generatedText}</p>
                  </div>
                </div>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setStep('input')}>Back</Button>
              <Button variant="secondary" onClick={handleGenerate}>Regenerate</Button>
              <Button onClick={handleUse}>Use This Draft</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
