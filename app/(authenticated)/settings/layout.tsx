import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - Tywn",
  description: "Configure your Tywn account settings.",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
