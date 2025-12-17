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
  const [schedulerStatus, setSchedulerStatus] = useState<{
    isRunning: boolean
    nextCheck?: Date
  }>({ isRunning: false })

  useEffect(() => {
    fetchPosts()
    fetchDashboardStats()
    fetchSchedulerStatus()
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

  const fetchSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/scheduler')
      if (response.ok) {
        const data = await response.json()
        setSchedulerStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch scheduler status:', error)
    }
  }

  const handleSchedulerAction = async (action: 'start' | 'stop' | 'restart' | 'process') => {
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (response.ok) {
        await fetchSchedulerStatus()
      }
    } catch (error) {
      console.error('Failed to manage scheduler:', error)
    }
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
        const data = await response.json()
        console.log(data.message) // "Post archived successfully"
        fetchPosts()
      } else {
        const responseData = await response.json()
        console.error('Archive request failed:', responseData)
        throw new Error(responseData.error || 'Failed to archive post')
      }
    } catch (error) {
      console.error('Error archiving post:', error)
      throw error // Re-throw to let the dialog handle the toast
    }
  }
  setDeleteDialog({ isOpen: false, postId: null, postText: "" })
}

// Separate function for PostDialog delete
const handlePostDialogDelete = async (post: any) => {
  try {
    console.log('Attempting to archive post from dialog:', post.id)
    const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Archive response:', data)
      fetchPosts()
    } else {
      const responseData = await response.json()
      console.error('Archive request failed:', responseData)
      throw new Error(responseData.error || 'Failed to archive post')
    }
  } catch (error) {
    console.error('Error archiving post:', error)
    throw error // Re-throw to let the dialog handle the toast
  }
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
      
      let response
      if (editingPost) {
        response = await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      } else {
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save post')
      }
      
      setShowDialog(false)
      setSelectedDate(undefined)
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      throw error // Re-throw to let the dialog handle the toast
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

        {/* Scheduler Controls */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#E0E0E0] glow">Scheduler Status</h2>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              schedulerStatus.isRunning 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {schedulerStatus.isRunning ? 'Running' : 'Stopped'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#E0E0E0]/70 mb-2">
                Status: {schedulerStatus.isRunning ? 'Active and checking scheduled posts' : 'Not running'}
              </p>
              {schedulerStatus.nextCheck && (
                <p className="text-sm text-[#E0E0E0]/70">
                  Next check: {schedulerStatus.nextCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!schedulerStatus.isRunning ? (
                <Button 
                  onClick={() => handleSchedulerAction('start')}
                  className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                  size="sm"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Start Scheduler
                </Button>
              ) : (
                <Button 
                  onClick={() => handleSchedulerAction('stop')}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  size="sm"
                >
                  Stop Scheduler
                </Button>
              )}
              
              <Button 
                onClick={() => handleSchedulerAction('process')}
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                size="sm"
              >
                Process Now
              </Button>
              
              <Button 
                onClick={() => handleSchedulerAction('restart')}
                className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30"
                size="sm"
              >
                Restart
              </Button>
            </div>
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
            onDelete={handlePostDialogDelete}
            selectedDate={selectedDate}
            user={user ? {
  username: user.username,
  displayName: user.displayName,
  profileImageUrl: user.profileImageUrl || ''
} : undefined}
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
