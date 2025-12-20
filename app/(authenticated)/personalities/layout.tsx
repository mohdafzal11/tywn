import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Personalities - Tywn",
  description: "Manage and configure AI personalities for your Tywn experience.",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
