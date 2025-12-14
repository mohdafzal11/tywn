"use client"

import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Link2, Image as ImageIcon } from "lucide-react"

interface TwitterPreviewProps {
  content: {
    tweetId?: string
    text: string
    image?: string
  }
  type: 'POST' | 'COMMENT' | 'THREAD'
  username?: string
  displayName?: string
  profileImageUrl?: string
  parentTweetId?: string
}

export function TwitterPreview({ 
  content, 
  type, 
  username = "user", 
  displayName = "User", 
  profileImageUrl,
  parentTweetId 
}: TwitterPreviewProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'COMMENT': return <MessageSquare className="h-4 w-4 text-blue-400" />
      case 'THREAD': return <Users className="h-4 w-4 text-purple-400" />
      default: return <MessageSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'COMMENT': return 'Reply'
      case 'THREAD': return 'Thread'
      default: return 'Post'
    }
  }

  return (
    <Card className="bg-black border border-gray-800 p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-white">{displayName}</span>
                <span className="text-gray-500">@{username}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>now</span>
                <span>·</span>
                <div className="flex items-center space-x-1">
                  {getTypeIcon()}
                  <span>{getTypeLabel()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Tweet Reply */}
        {parentTweetId && (
          <div className="border-l-2 border-gray-700 pl-4 mb-3">
            <div className="text-gray-500 text-sm mb-1">Replying to tweet @{parentTweetId}</div>
            <div className="text-gray-400 text-sm">Original tweet content would appear here...</div>
          </div>
        )}

        {/* Content */}
        <div className="text-white whitespace-pre-wrap">
          {content.text}
        </div>

        {/* Images */}
        {content.image && (
          <div className="rounded-xl overflow-hidden border border-gray-800">
            <img
              src={content.image}
              alt="Post image"
              className="w-full h-auto object-cover max-h-64"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-400 transition-colors">
              <div className="h-4 w-4 rounded-full border-2 border-gray-500" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
              <div className="h-4 w-4">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors">
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
