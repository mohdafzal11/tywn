import { Sidebar } from "@/components/sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendar - Tywn",
  description: "Manage your events and schedule with the Tywn calendar. View upcoming events and plan your activities.",
  keywords: ["calendar", "events", "schedule", "tywn", "planning"],
  openGraph: {
    title: "Calendar - Tywn",
    description: "Manage your events and schedule with the Tywn calendar. View upcoming events and plan your activities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendar - Tywn",
    description: "Manage your events and schedule with the Tywn calendar. View upcoming events and plan your activities.",
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
