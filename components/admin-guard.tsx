"use client"

import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.log('AdminGuard - loading:', loading, 'user:', user)
    if (!loading && user && user.role !== "ADMIN") {
      console.log('Redirecting non-admin user to dashboard')
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64FFDA]"></div>
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    console.log('AdminGuard - blocking access, user:', user)
    return null
  }

  console.log('AdminGuard - allowing access')
  return <>{children}</>
}
