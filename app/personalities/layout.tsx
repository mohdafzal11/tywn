import { Sidebar } from "@/components/sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Personalities - Tywn",
  description: "Manage and configure AI personalities for your Tywn experience.",
  keywords: ["personalities", "ai", "characters", "tywn", "settings"],
  openGraph: {
    title: "Personalities - Tywn",
    description: "Manage and configure AI personalities for your Tywn experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalities - Tywn",
    description: "Manage and configure AI personalities for your Tywn experience.",
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
