"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from '@/components/auth-guard'
import { PostDialog } from '@/components/post-dialog'
import { PostCalendar } from '@/components/post-calendar'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, MessageSquare, Image as ImageIcon, Clock, CheckCircle, Archive, Eye } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Post } from "@/types"

export default function DashboardPage() {
  const { user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    postId: string | null
    postText: string
  }>({ isOpen: false, postId: null, postText: "" })

  useEffect(() => {
    fetchPosts()
    fetchDashboardStats()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts${user ? `?userId=${user.id}` : ''}`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    // This would fetch real stats from your API
    // For now, using placeholder data
  }

  const handleCreate = (date?: Date) => {
    setEditingPost(null)
    setSelectedDate(date)
    setShowDialog(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setSelectedDate(undefined)
    setShowDialog(true)
  }

  const handlePublishPost = async (post: Post) => {
    try {
      await fetch(`/api/posts/${post.id}/publish`, {
        method: 'POST'
      })
      fetchPosts()
    } catch (error) {
      console.error('Error publishing post:', error)
    }
  }

  const handleArchivePost = async (post: Post) => {
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ARCHIVED'
        })
      })
      fetchPosts()
    } catch (error) {
      console.error('Error archiving post:', error)
    }
  }

  const handleDelete = (post: Post) => {
    setDeleteDialog({
      isOpen: true,
      postId: post.id,
      postText: post.content.text.length > 50 ? post.content.text.substring(0, 50) + '...' : post.content.text
    })
  }

  const confirmDelete = async () => {
    if (deleteDialog.postId) {
      try {
        const response = await fetch(`/api/posts/${deleteDialog.postId}`, { method: 'DELETE' })
        
        if (response.ok) {
          fetchPosts()
        } else {
          const responseData = await response.json()
          console.error('DELETE request failed:', responseData)
        }
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
    setDeleteDialog({ isOpen: false, postId: null, postText: "" })
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, postId: null, postText: "" })
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const postData = { 
        ...data, 
        userId: user?.id,
        status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT'
      }
      
      if (editingPost) {
        await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      } else {
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      }
      setShowDialog(false)
      setSelectedDate(undefined)
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64FFDA]"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#E0E0E0] glow">Dashboard</h1>
          <Button onClick={() => handleCreate()} className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Total Posts</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">{posts.length}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Scheduled</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">
              {posts.filter(p => p.status === 'SCHEDULED').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Published</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">
              {posts.filter(p => p.status === 'PUBLISHED').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Drafts</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">
              {posts.filter(p => p.status === 'DRAFT').length}
            </p>
          </div>
        </div>

        {showDialog && (
          <PostDialog
            post={editingPost}
            isOpen={showDialog}
            onClose={() => {
              setShowDialog(false)
              setSelectedDate(undefined)
              setEditingPost(null)
            }}
            onSubmit={handleFormSubmit}
            selectedDate={selectedDate}
            user={user || undefined}
          />
        )}

        
        {/* Calendar View */}
        <PostCalendar
          posts={posts}
          onPostClick={handleEdit}
          onCreatePost={handleCreate}
        />

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Post"
          message={`Are you sure you want to delete this post: "${deleteDialog.postText}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </AuthGuard>
  )
}
