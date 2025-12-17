"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Eye, Clock, ImageIcon, Sparkles, Trash2 } from "lucide-react"
import { TwitterPreview } from "./twitter-preview"
import { AiGenerationDialog } from "./ai-generation-dialog"
import { toast } from "sonner"

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
      
      // Show success toast based on action
      if (formData.action === 'PUBLISH') {
        toast.success('Post published successfully!')
      } else if (formData.action === 'SCHEDULE') {
        toast.success('Post scheduled successfully!')
      } else {
        toast.success('Post saved as draft!')
      }
      
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
    setFormData({
      content: {
        tweetUrl: "",
        text: "",
        image: ""
      },
      type: 'POST',
      action: 'DRAFT',
      scheduledAt: "",
      status: 'DRAFT'
    })
    setShowPreview(false)
    onClose()
  }

  const handleAiGeneratedText = (generatedText: string) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        text: generatedText
      }
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0c0c0c] border border-white/10 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#E0E0E0]">
                {post ? "Edit Post" : "Create Post"}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Preview Section */}
              {showPreview && (
                <div className="w-96">
                  <div className="sticky top-6">
                    <h3 className="text-sm font-medium text-[#E0E0E0]/70 mb-3">Preview</h3>
                    <TwitterPreview
                      content={formData.content}
                      type={formData.type}
                      username={user?.username}
                      displayName={user?.displayName}
                      profileImageUrl={user?.profileImageUrl}
                    />
                  </div>
                </div>
              )}

              {/* Form Section */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                      Post Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'POST' | 'COMMENT' | 'THREAD' })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                    >
                      <option value="POST">Post</option>
                      <option value="COMMENT">Comment</option>
                      <option value="THREAD">Thread</option>
                    </select>
                    <div className="text-xs text-[#E0E0E0]/50 mt-1">
                      {formData.type === 'POST' && 'Create a new post'}
                      {formData.type === 'COMMENT' && 'Reply to an existing post'}
                      {formData.type === 'THREAD' && 'Start a thread conversation'}
                    </div>
                  </div>

                  {formData.type === 'COMMENT' && (
                    <div>
                      <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                        Tweet URL to Reply To
                      </label>
                      <input
                        type="url"
                        value={formData.content.tweetUrl}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          content: { ...formData.content, tweetUrl: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                        placeholder="https://twitter.com/username/status/1234567890123456789"
                      />
                      <div className="text-xs text-[#E0E0E0]/50 mt-1">
                        Paste full Twitter URL of tweet you want to comment on
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                      Post Text
                    </label>
                    <textarea
                      value={formData.content.text}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        content: { ...formData.content, text: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA] h-32 resize-none"
                      placeholder={formData.type === 'COMMENT' ? "What's your reply?" : formData.type === 'THREAD' ? "Start your thread..." : "What's on your mind?"}
                      required
                      maxLength={280}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-[#E0E0E0]/50">
                        {formData.content.text.length}/280 characters
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowAiDialog(true)}
                        className="bg-[#64FFDA]/20 text-[#64FFDA] hover:bg-[#64FFDA]/30 border border-[#64FFDA]/30"
                        size="sm"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate with AI
                      </Button>
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
                        value={formData.content.image}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          content: { ...formData.content, image: e.target.value }
                        })}
                        className="w-full pl-10 pr-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {formData.content.image && (
                      <div>
                        <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                          Image Preview
                        </label>
                        <img
                          src={formData.content.image}
                          alt="Preview"
                          className="max-w-full h-auto rounded-lg border border-white/10 max-h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                      Action
                    </label>
                    <select
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value as 'DRAFT' | 'SCHEDULE' | 'PUBLISH' })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                    >
                      <option value="DRAFT">Save as Draft</option>
                      <option value="SCHEDULE">Schedule Post</option>
                      <option value="PUBLISH">Publish Now</option>
                    </select>
                    <div className="text-xs text-[#E0E0E0]/50 mt-1">
                      {formData.action === 'DRAFT' && 'Save post without publishing'}
                      {formData.action === 'SCHEDULE' && 'Schedule post for later publishing'}
                      {formData.action === 'PUBLISH' && 'Publish post immediately'}
                    </div>
                  </div>

                  {formData.action === 'SCHEDULE' && (
                    <div>
                      <label className="block text-sm font-medium text-[#E0E0E0]/70 mb-2">
                        Schedule Date & Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#E0E0E0]/50" />
                        <input
                          type="datetime-local"
                          value={formData.scheduledAt}
                          onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#64FFDA]"
                          step="1"
                        />
                      </div>
                      <div className="text-xs text-[#E0E0E0]/50 mt-1">
                        Select when you want this post to be published. You can choose any date and time, including past dates.
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {post && onDelete && (
                      <Button 
                        type="button" 
                        onClick={handleDelete}
                        disabled={isSubmitting || isDeleting}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/50"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                            Archiving...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Archive
                          </>
                        )}
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting || isDeleting} className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#050505] mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Post'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleClose}
                      disabled={isSubmitting || isDeleting}
                      variant="outline"
                      className="border-white/10 text-[#E0E0E0]/70 hover:text-[#64FFDA] hover:border-[#64FFDA]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AiGenerationDialog
        isOpen={showAiDialog}
        onClose={() => setShowAiDialog(false)}
        onGenerate={handleAiGeneratedText}
      />
    </>
  )
}