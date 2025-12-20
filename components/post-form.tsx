"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Clock } from "lucide-react"

interface PostFormProps {
  post?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState({
    content: post?.content || "",
    image: post?.image || "",
    scheduledAt: post?.scheduledAt || ""
  })

  // Basic mock form for legacy compatibility, but styled with new UI
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? "Edit Post" : "Create Post"}</CardTitle>
      </CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData) }}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="What's on your mind?"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL (Optional)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Schedule (Optional)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="datetime-local"
                className="pl-9"
                value={formData.scheduledAt}
                onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Post</Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
