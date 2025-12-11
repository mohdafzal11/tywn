"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { 
  LayoutDashboard, 
  Settings, 
  Calendar,
  LogOut,
  User
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, loading, logout } = useUser()

  return (
    <div className={cn("flex h-full w-64 flex-col bg-[#0c0c0c] border-r border-white/10", className)}>
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-8">
          <h2 className="px-3 text-lg font-semibold text-[#E0E0E0] glow">Tywn</h2>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all smooth",
                isActive
                  ? "bg-[#64FFDA]/20 text-[#64FFDA]"
                  : "text-[#E0E0E0]/70 hover:bg-white/5 hover:text-[#64FFDA]"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 smooth",
                  isActive ? "text-[#64FFDA]" : "text-[#E0E0E0]/50 group-hover:text-[#64FFDA]"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Details Section */}
      <div className="border-t border-white/10 p-4">
        {loading ? (
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#1a1a1a] animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-[#1a1a1a] rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.displayName || user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#64FFDA] to-[#9E4BFF] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#050505]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E0E0E0] truncate">
                {user.displayName || user.username || 'Unknown User'}
              </p>
              <p className="text-xs text-[#E0E0E0]/50 truncate">
                @{user.username || 'unknown'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#64FFDA] to-[#9E4BFF] flex items-center justify-center">
                <User className="h-4 w-4 text-[#050505]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E0E0E0] truncate">Not logged in</p>
              <p className="text-xs text-[#E0E0E0]/50 truncate">Please login</p>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#E0E0E0]/70 rounded-lg hover:bg-[#64FFDA]/10 hover:text-[#64FFDA] transition-all smooth disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={logout}
          disabled={!user || loading}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {loading ? 'Loading...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
