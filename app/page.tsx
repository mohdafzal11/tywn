import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tywn - Connect, Create, Collaborate",
  description: "Welcome to Tywn - your modern platform for social connection, collaboration, and creative expression.",
  keywords: ["social media", "connection", "collaboration", "tywn", "platform"],
  openGraph: {
    title: "Tywn - Connect, Create, Collaborate",
    description: "Welcome to Tywn - your modern platform for social connection, collaboration, and creative expression.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tywn - Connect, Create, Collaborate",
    description: "Welcome to Tywn - your modern platform for social connection, collaboration, and creative expression.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#64FFDA]/10 via-transparent to-[#9E4BFF]/10 pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground glow md:text-7xl">
              Welcome to <span className="text-accent">Tywn</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[#E0E0E0]/80 md:text-xl">
              Connect with friends, collaborate on projects, and express your creativity in a modern, intuitive platform designed for meaningful interactions.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="btn hover:scale-105 hover:bg-[#64FFDA] hover:shadow-[0_0_25px_#64FFDA] transition-all duration-300">
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="btn-outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground glow md:text-4xl">
              Everything You Need to Connect
            </h2>
            <p className="text-lg text-[#E0E0E0]/70">
              Powerful features designed for modern social interaction
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Real-time Chat</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Instant messaging with friends and groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Stay connected with real-time messaging, file sharing, and rich media support.
                </p>
              </CardContent>
            </Card>

            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Calendar Integration</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Schedule events and never miss a moment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Organize your life with integrated calendar, reminders, and event planning tools.
                </p>
              </CardContent>
            </Card>

            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Collaboration Tools</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Work together seamlessly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Share documents, manage projects, and collaborate with your team efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Privacy First</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Your data, your control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Advanced privacy controls and encryption to keep your information secure.
                </p>
              </CardContent>
            </Card>

            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Customizable</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Make it yours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Personalize your experience with themes, layouts, and custom profiles.
                </p>
              </CardContent>
            </Card>

            <Card className="card frosted">
              <CardHeader>
                <CardTitle className="text-accent">Cross-Platform</CardTitle>
                <CardDescription className="text-[#E0E0E0]/70">
                  Connect anywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[#E0E0E0]/60">
                  Access Tywn from any device with our responsive web and mobile apps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="card frosted neon-border p-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground glow md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-[#E0E0E0]/70">
              Join thousands of users already connecting on Tywn
            </p>
            <Link href="/login">
              <Button size="lg" className="btn">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
