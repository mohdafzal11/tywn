"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PersonalityFormProps {
  personality?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PersonalityForm({ personality, onSubmit, onCancel }: PersonalityFormProps) {
  const [formData, setFormData] = useState({
    name: personality?.name || "",
    profileImageUrl: personality?.profileImageUrl || "",
    prompt: personality?.prompt || "",
    tags: personality?.tags?.join(", ") || "",
    isActive: personality?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    })
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{personality ? "Edit Personality" : "Add Personality"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Friendly Assistant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.profileImageUrl}
              onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="min-h-[120px]"
              required
              placeholder="Define the personality's behavior..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="friendly, professional, casual"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {personality ? "Update Personality" : "Create Personality"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
