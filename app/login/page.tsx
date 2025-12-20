"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getApiUrl } from "@/lib/utils";
import { Twitter } from "lucide-react";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      const response = await fetch(getApiUrl('/login'));
      console.log(response.url);
      window.open(response.url)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-secondary/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="border-muted/40 shadow-xl backdrop-blur-sm bg-background/80">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="w-full relative h-12 text-base font-medium transition-all hover:bg-muted/50"
              onClick={handleLogin}
            >
              <Twitter className="mr-2 h-5 w-5 fill-current" />
              Sign in with X
            </Button>
          </CardContent>
          <CardFooter>
            <p className="px-8 text-center text-xs text-muted-foreground w-full">
              By clicking continue, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
