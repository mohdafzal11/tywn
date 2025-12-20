"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Eye, ImageIcon, Sparkles, Trash2, Clock } from "lucide-react"
import { TwitterPreview } from "./twitter-preview"
import { AiGenerationDialog } from "./ai-generation-dialog"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface PostDialogProps {
  post?: any
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  onDelete?: (post: any) => void
  selectedDate?: Date
  user?: {
    username?: string
    displayName?: string
    profileImageUrl: string
  }
}

export function PostDialog({ post, isOpen, onClose, onSubmit, onDelete, selectedDate, user }: PostDialogProps) {
  const [formData, setFormData] = useState({
    content: {
      tweetUrl: post?.content?.tweetUrl || "",
      text: post?.content?.text || "",
      image: post?.content?.image || ""
    },
    type: post?.type || 'POST',
    action: post?.status === 'PUBLISHED' ? 'PUBLISH' : (post?.scheduledAt ? 'SCHEDULE' : (selectedDate ? 'SCHEDULE' : 'DRAFT')),
    scheduledAt: post?.scheduledAt
      ? new Date(post.scheduledAt).toISOString().slice(0, 16)
      : selectedDate
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), new Date().getHours(), new Date().getMinutes() + 30).toISOString().slice(0, 16)
        : "",
    status: post?.status || 'DRAFT'
  })

  const [showPreview, setShowPreview] = useState(true)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    /* ... logic reuse ... */
    let submitData: any = {
      ...formData,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null
    }

    if (formData.action === 'PUBLISH') {
      submitData.status = 'PUBLISHED'
      submitData.publishedAt = new Date().toISOString()
    } else if (formData.action === 'SCHEDULE') {
      submitData.status = 'SCHEDULED'
      if (!submitData.scheduledAt) {
        toast.error('Please select a schedule date and time')
        return
      }
    } else {
      submitData.status = 'DRAFT'
      submitData.scheduledAt = null
    }

    setIsSubmitting(true)

    try {
      await onSubmit(submitData)
      if (formData.action === 'PUBLISH') toast.success('Post published successfully!')
      else if (formData.action === 'SCHEDULE') toast.success('Post scheduled successfully!')
      else toast.success('Post saved as draft!')

      handleClose()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(post)
      toast.success('Post archived successfully!')
      handleClose()
    } catch (error) {
      console.error('Error archiving post:', error)
      toast.error('Failed to archive post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    // Reset form logic
    setFormData({
      content: { tweetUrl: "", text: "", image: "" },
      type: 'POST',
      action: 'DRAFT',
      scheduledAt: "",
      status: 'DRAFT'
    })
    setShowPreview(false)
    onClose()
  }

  const handleAiGeneratedText = (generatedText: string) => {
    setFormData({ ...formData, content: { ...formData.content, text: generatedText } })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{post ? "Edit Post" : "Create Post"}</DialogTitle>
            <DialogDescription>Create or edit your content schedule.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 py-4">
            {/* Main Form */}
            <div className="flex-1 space-y-4">
              <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POST">Post</SelectItem>
                      <SelectItem value="COMMENT">Comment</SelectItem>
                      <SelectItem value="THREAD">Thread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'COMMENT' && (
                  <div className="space-y-2">
                    <Label>Tweet URL to Reply To</Label>
                    <Input
                      placeholder="https://twitter.com/..."
                      value={formData.content.tweetUrl}
                      onChange={e => setFormData({ ...formData, content: { ...formData.content, tweetUrl: e.target.value } })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Post Content</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={() => setShowAiDialog(true)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    className="h-32 resize-none"
                    placeholder={formData.type === 'COMMENT' ? "What's your reply?" : "What's on your mind?"}
                    value={formData.content.text}
                    onChange={e => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
                    maxLength={280}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.content.text.length}/280</p>
                </div>

                <div className="space-y-2">
                  <Label>Image URL (Optional)</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="https://..."
                      value={formData.content.image}
                      onChange={e => setFormData({ ...formData, content: { ...formData.content, image: e.target.value } })}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.action}
                      onValueChange={(val: any) => setFormData({ ...formData, action: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="SCHEDULE">Schedule</SelectItem>
                        <SelectItem value="PUBLISH">Publish Now</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.action === 'SCHEDULE' && (
                    <div className="space-y-2">
                      <Label>Date & Time</Label>
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
                  )}
                </div>
              </form>
            </div>

            {/* Preview Sidebar */}
            <div className="md:w-80 border-l pl-6 hidden md:block space-y-4">
              <Label className="mb-2 block">Live Preview</Label>
              <TwitterPreview
                content={formData.content}
                type={formData.type}
                username={user?.username}
                displayName={user?.displayName}
                profileImageUrl={user?.profileImageUrl}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {post && onDelete && (
              <Button
                variant="destructive"
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="mr-auto"
              >
                {isDeleting ? 'Archiving...' : <><Trash2 className="h-4 w-4 mr-2" /> Archive</>}
              </Button>
            )}

            <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="post-form" disabled={isSubmitting || isDeleting}>
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AiGenerationDialog
        isOpen={showAiDialog}
        onClose={() => setShowAiDialog(false)}
        onGenerate={handleAiGeneratedText}
      />
    </>
  )
}