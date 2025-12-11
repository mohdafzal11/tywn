// app/api/twitter/login/route.ts
import { NextResponse } from "next/server";
import { generatePKCE } from "@/lib/utils";
import { redisHandler } from "@/lib/redis";


export async function GET() {
  const X_CLIENT_ID = process.env.X_CLIENT_ID!;
  const X_REDIRECT_URI = process.env.X_REDIRECT_URI!;
  const X_SCOPES = process.env.X_SCOPES!;

  const { code_verifier, code_challenge } = await generatePKCE();

  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((s, byte) => s + byte.toString(16).padStart(2, "0"), "");

  // Store PKCE data in Redis with 10 minute expiration
  await redisHandler.set(`pkce:${state}`, {
    code_verifier,
    storedState: state
  }, { expirationTime: 600 }); // 10 minutes

  const authURL = new URL("https://twitter.com/i/oauth2/authorize");
  authURL.searchParams.set("response_type", "code");
  authURL.searchParams.set("client_id", X_CLIENT_ID);
  authURL.searchParams.set("redirect_uri", X_REDIRECT_URI);
  authURL.searchParams.set("scope", X_SCOPES);
  authURL.searchParams.set("state", state);
  authURL.searchParams.set("code_challenge", code_challenge);
  authURL.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(authURL.toString());
}
