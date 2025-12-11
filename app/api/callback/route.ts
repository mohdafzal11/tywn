import { NextRequest, NextResponse } from "next/server";
import { redisHandler } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const error = req.nextUrl.searchParams.get("error");

    if (error) return NextResponse.json({ error }, { status: 400 });
    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    const X_CLIENT_ID = process.env.X_CLIENT_ID!;
    const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET!;
    const X_REDIRECT_URI = process.env.X_REDIRECT_URI!;

    // Get stored PKCE values
    const pkceData = await redisHandler.get<{
      code_verifier: string;
      storedState: string;
    }>(`pkce:${state}`);

    if (!pkceData) throw new Error("Invalid or expired state");
    if (pkceData.storedState !== state) throw new Error("Invalid state");

    const { code_verifier } = pkceData;

    // --- Exchange code for access token ---
    const authHeader = Buffer.from(
      `${X_CLIENT_ID}:${X_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: X_REDIRECT_URI,
        code_verifier,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("Token response:", tokenData);

    if (!tokenData.access_token) {
      throw new Error("Failed to exchange code for token: " + JSON.stringify(tokenData));
    }

    // --- Fetch user info using Twitter API v2 ---
    const userRes = await fetch(
      "https://api.twitter.com/2/users/me?user.fields=name,username,profile_image_url",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userRes.json();

    console.log("User data:", userData);

    if (!userData || !userData.data) {
      throw new Error("Failed to fetch user data: " + JSON.stringify(userData));
    }

    const user = {
      id: userData.data.id,
      username: userData.data.username,
      name: userData.data.name,
      profile_image_url: userData.data.profile_image_url,
    };

    // --- Store user in DB ---
    await prisma.user.upsert({
      where: { twitterId: user.id },
      update: {
        username: user.username,
        displayName: user.name,
        profileImageUrl: user.profile_image_url,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        lastLoginAt: new Date(),
      },
      create: {
        twitterId: user.id,
        username: user.username,
        displayName: user.name,
        profileImageUrl: user.profile_image_url,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      },
    });

    // Clean up PKCE data
    await redisHandler.delete(`pkce:${state}`);

    // Get the user from database to get the internal ID
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
      select: { id: true }
    });

    if (!dbUser) {
      throw new Error("User not found in database after upsert");
    }

    // --- Redirect user to dashboard ---
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://twyn-livid.vercel.app"
        : "http://localhost:3000";

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);

    // Set session cookie with user ID for the user API
    response.cookies.set("session", encodeURIComponent(JSON.stringify({
      userId: dbUser.id,
      twitterId: user.id,
      username: user.username,
      displayName: user.name
    })), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("x_user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    response.cookies.set("x_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Twitter login error:", err);
    return NextResponse.json(
      {
        error: "Failed to login with Twitter",
        details: err.message || err,
      },
      { status: 500 }
    );
  }
}
