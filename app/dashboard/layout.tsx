import { Sidebar } from "@/components/sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Tywn",
  description: "View your Tywn dashboard with analytics, user statistics, and activity overview.",
  keywords: ["dashboard", "analytics", "stats", "tywn", "overview"],
  openGraph: {
    title: "Dashboard - Tywn",
    description: "View your Tywn dashboard with analytics, user statistics, and activity overview.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Tywn",
    description: "View your Tywn dashboard with analytics, user statistics, and activity overview.",
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
