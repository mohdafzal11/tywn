"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MessageSquare, Clock, CheckCircle, Archive } from "lucide-react"
import { Post } from "@/types"

interface PostCalendarProps {
  posts: Post[]
  onPostClick: (post: Post) => void
  onCreatePost: (date: Date) => void
}

export function PostCalendar({ posts, onPostClick, onCreatePost }: PostCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getPostsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    return posts.filter(post => {
      if (post.scheduledAt) {
        const scheduledDate = new Date(post.scheduledAt)
        return scheduledDate >= startOfDay && scheduledDate <= endOfDay
      }
      if (post.publishedAt) {
        const publishedDate = new Date(post.publishedAt)
        return publishedDate >= startOfDay && publishedDate <= endOfDay
      }
      const createdDate = new Date(post.createdAt)
      return createdDate >= startOfDay && createdDate <= endOfDay
    }).sort((a, b) => {
      // Sort by scheduled time, then published time, then created time
      const timeA = new Date(a.scheduledAt || a.publishedAt || a.createdAt).getTime()
      const timeB = new Date(b.scheduledAt || b.publishedAt || b.createdAt).getTime()
      return timeA - timeB
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500'
      case 'SCHEDULED': return 'bg-blue-500'
      case 'PUBLISHED': return 'bg-green-500'
      case 'ARCHIVED': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getPostTime = (post: Post) => {
    if (post.scheduledAt) {
      return new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    if (post.publishedAt) {
      return new Date(post.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = getDaysInMonth(currentDate)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-[#64FFDA]" />
          <h2 className="text-xl font-semibold text-[#E0E0E0]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigateMonth('prev')}
            className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigateMonth('next')}
            className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-[#E0E0E0]/50 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dayPosts = getPostsForDate(day)
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
          const isPastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)

          return (
            <div
              key={day}
              className={`aspect-square border border-white/10 rounded-lg p-1 hover:bg-white/5 cursor-pointer transition-colors ${
                isToday ? 'border-[#64FFDA] bg-[#64FFDA]/5' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-[#E0E0E0]/70">{day}</span>
                {dayPosts.length > 0 && (
                  <span className="text-xs text-[#64FFDA] bg-[#64FFDA]/20 px-1 rounded">
                    {dayPosts.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {dayPosts.slice(0, 4).map((post, postIndex) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-1 text-xs hover:bg-white/10 rounded p-0.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPostClick(post)
                    }}
                    title={`${post.status} - ${getPostTime(post)}: ${post.content?.text || 'No text'}`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(post.status)}`} />
                    <span className="text-[#E0E0E0]/70 truncate flex-1">
                      {post.content?.text ? post.content.text.substring(0, 15) + '...' : 'No text...'}
                    </span>
                    <span className="text-[#E0E0E0]/50 flex-shrink-0 text-[10px]">
                      {getPostTime(post)}
                    </span>
                  </div>
                ))}
                {dayPosts.length > 4 && (
                  <div className="text-xs text-[#E0E0E0]/30 text-center py-1">
                    +{dayPosts.length - 4} more
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-1">
                <button
                  className={`w-full text-xs rounded py-0.5 transition-colors ${
                    isPastDate 
                      ? 'text-[#E0E0E0]/30 cursor-not-allowed' 
                      : 'text-[#64FFDA] hover:bg-[#64FFDA]/10'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isPastDate) {
                      onCreatePost(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                    }
                  }}
                  disabled={isPastDate}
                >
                  {isPastDate ? 'Past Date' : '+ Add Post'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-[#E0E0E0]/70">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-[#E0E0E0]/70">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[#E0E0E0]/70">Published</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-[#E0E0E0]/70">Archived</span>
        </div>
      </div>
    </Card>
  )
}
