"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Image as ImageIcon, Clock } from "lucide-react"

interface PostFormProps {
  post?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState({
    text: post?.text || "",
    image: post?.image || "",
    scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "",
    status: post?.status || 'DRAFT'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null
    }
    onSubmit(submitData)
  }

  return (
    <Card className="p-6 mb-4">
      <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">
        {post ? "Edit Post" : "Create Post"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Post Text
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA] h-32 resize-none"
            placeholder="What's on your mind?"
            required
            maxLength={280}
          />
          <div className="text-xs text-[#E0E0E0]/50 mt-1">
            {formData.text.length}/280 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Image URL (optional)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#E0E0E0]/50" />
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full pl-10 pr-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {formData.image && (
          <div>
            <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
              Image Preview
            </label>
            <img
              src={formData.image}
              alt="Preview"
              className="max-w-full h-auto rounded-lg border border-white/10 max-h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
            Schedule Post (optional)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#E0E0E0]/50" />
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full pl-10 pr-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="text-xs text-[#E0E0E0]/50 mt-1">
            Leave empty to save as draft
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
            {post ? "Update" : (formData.scheduledAt ? "Schedule" : "Create")}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
