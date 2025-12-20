"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react"
import { Post } from "@/types"
import { cn } from "@/lib/utils"

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
      let d
      if (post.scheduledAt) d = new Date(post.scheduledAt)
      else if (post.publishedAt) d = new Date(post.publishedAt)
      else d = new Date(post.createdAt)
      return d >= startOfDay && d <= endOfDay
    }).sort((a, b) => {
      const timeA = new Date(a.scheduledAt || a.publishedAt || a.createdAt).getTime()
      const timeB = new Date(b.scheduledAt || b.publishedAt || b.createdAt).getTime()
      return timeA - timeB
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-muted-foreground'
      case 'SCHEDULED': return 'bg-blue-500'
      case 'PUBLISHED': return 'bg-green-500'
      case 'ARCHIVED': return 'bg-orange-500'
      default: return 'bg-primary'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') newDate.setMonth(prev.getMonth() - 1)
      else newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = getDaysInMonth(currentDate)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted/20 rounded-lg overflow-hidden border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-background py-2 text-center text-xs font-semibold text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="bg-background/50 h-32" />

          const dayPosts = getPostsForDate(day)
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
          const isPastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getTime() < new Date().setHours(0, 0, 0, 0)

          return (
            <div
              key={day}
              className={cn(
                "bg-background h-32 p-2 relative group hover:bg-muted/10 transition-colors border-t border-l border-white/5",
                isToday && "bg-accent/5 ring-1 ring-inset ring-primary/20",
              )}
              onClick={() => !isPastDate && onCreatePost(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            >
              <span className={cn(
                "text-sm font-medium",
                isToday ? "text-primary bg-primary/10 px-1.5 py-0.5 rounded-full" : "text-muted-foreground"
              )}>
                {day}
              </span>

              <div className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                {dayPosts.map(post => {
                  const time = new Date(post.scheduledAt || post.publishedAt || post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onPostClick(post)
                      }}
                      className="text-[10px] p-1 rounded bg-muted/30 hover:bg-primary/10 hover:text-primary cursor-pointer truncate border border-transparent hover:border-primary/20 transition-all flex items-center gap-1.5"
                    >
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", getStatusColor(post.status))} />
                      <span className="truncate">{time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
