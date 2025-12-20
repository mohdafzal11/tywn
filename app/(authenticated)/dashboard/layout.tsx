import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Tywn",
  description: "View your Tywn dashboard with analytics, user statistics, and activity overview.",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
