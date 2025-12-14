"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
    <Card className="p-6 mb-4">
      <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
        {personality ? "Edit Personality" : "Add Personality"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.profileImageUrl}
            onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Prompt
          </label>
          <textarea
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA] h-32 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
            placeholder="friendly, professional, casual"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
            {personality ? "Update" : "Create"}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
