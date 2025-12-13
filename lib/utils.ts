import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getPageUrl(path: string) {
  const basePath: string = (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_PATH || '').trim() || 'https://droomdroom.com/airdrops'
  const cleanPath = path.trim()
  return `${basePath}${cleanPath}`
}

export function getApiUrl(path: string) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const baseUrl = isDevelopment ? 'http://localhost:3000' : 
    (process.env.NEXT_PUBLIC_BASE_URL || 'https://tywn.vercel.app')
  
  const cleanPath = path.trim()
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath
  return `${baseUrl}/api${cleanPath}`
}


// utils/pkce.ts
export function base64urlEncode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function generatePKCE() {
  // Random code verifier
  const code_verifier = Array.from(crypto.getRandomValues(new Uint8Array(64)))
    .map((b) => ("0" + b.toString(16)).slice(-2))
    .join("");

  // SHA256 hash and base64url encode
  const hashed = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  const code_challenge = base64urlEncode(hashed);

  return { code_verifier, code_challenge };
}


