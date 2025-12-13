import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Tywn",
  description: "Sign in to your Tywn account to connect and engage with the future of social networking.",
  keywords: ["login", "signin", "auth", "tywn", "social media"],
  openGraph: {
    title: "Login - Tywn",
    description: "Sign in to your Tywn account to connect and engage with the future of social networking.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Tywn",
    description: "Sign in to your Tywn account to connect and engage with the future of social networking.",
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
