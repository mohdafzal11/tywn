"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { getApiUrl } from "@/lib/utils";

const FullPageBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-background">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--accent-secondary)_0%,_transparent_40%)] opacity-10 animate-pulse" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--accent)_0%,_transparent_40%)] opacity-10 animate-pulse [animation-delay:'2s']" />
    <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background opacity-70" />
  </div>
);

export default function LoginPage() {
  const router = useRouter();

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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
      <FullPageBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
      >
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-2">
          Tywn
        </h1>
        <p className="text-lg text-foreground/60 mb-10">
          The future of social connection is here.
        </p>

        <Button
          onClick={handleLogin}
          className="w-full text-lg font-bold smooth hover:glow border-2 rounded-full cursor-pointer"
          size="lg"
        >
          Login with X
        </Button>


        <p className="mt-8 text-xs text-foreground/40">
          By continuing, you agree to \Tywn's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </main>
  );
}
