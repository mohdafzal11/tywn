import Link from "next/link";
import { ArrowRight, MessageSquare, Calendar, Users, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <Badge className="mb-6 px-4 py-1.5 text-sm font-normal rounded-full transition-all hover:bg-secondary" variant="secondary">
            v1.0 Now Available
          </Badge>
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Connect, Create, <br className="hidden sm:inline" />
            Collaborate
          </h1>
          <p className="mb-10 max-w-[42rem] text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Tywn is your modern platform for social connection and creative expression.
            Experience a new standard of community interaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto rounded-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto rounded-full border-muted-foreground/20">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-32 bg-muted/20">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Engineered for Connection
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features wrapped in a refined, minimalist interface.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative p-8 bg-background rounded-3xl border border-muted/50 hover:border-primary/10 transition-all hover:shadow-lg">
              <div className="mb-6 w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Chat</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamless instant messaging with friends and groups. Share media, files, and thoughts instantly.
              </p>
            </div>

            <div className="group relative p-8 bg-background rounded-3xl border border-muted/50 hover:border-primary/10 transition-all hover:shadow-lg">
              <div className="mb-6 w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast & Collaborative</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built for speed. Collaborate on documents and projects in real-time with zero latency.
              </p>
            </div>

            <div className="group relative p-8 bg-background rounded-3xl border border-muted/50 hover:border-primary/10 transition-all hover:shadow-lg">
              <div className="mb-6 w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data is yours. End-to-end encryption and advanced privacy controls keep you secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-24 text-center shadow-2xl">
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
                Ready to join?
              </h2>
              <p className="mb-10 text-lg text-primary-foreground/80">
                Start your journey with Tywn today. No credit card required.
              </p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-lg">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Subtle Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t">
        <div className="px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Tywn Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
