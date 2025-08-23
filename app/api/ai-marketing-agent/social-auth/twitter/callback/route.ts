import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

// Twitter OAuth Configuration
const TWITTER_CLIENT_ID =
  process.env.TWITTER_CLIENT_ID || "your_twitter_client_id";
const TWITTER_CLIENT_SECRET =
  process.env.TWITTER_CLIENT_SECRET || "your_twitter_client_secret";
const REDIRECT_URI = `${
  process.env.NEXTAUTH_URL || "http://localhost:3000"
}/api/ai-marketing-agent/social-auth/twitter/callback`;

// Debug logging
console.log("Twitter OAuth Callback Configuration:");
console.log("TWITTER_CLIENT_ID:", TWITTER_CLIENT_ID);
console.log(
  "TWITTER_CLIENT_SECRET:",
  TWITTER_CLIENT_SECRET ? "SET" : "NOT SET"
);
console.log("REDIRECT_URI:", REDIRECT_URI);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Twitter OAuth error:", error);
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
          error
        )}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
          "No authorization code received"
        )}`
      );
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
          "Authentication required"
        )}`
      );
    }

    const userId = session.user.email;

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.twitter.com/2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: "challenge", // In production, use proper PKCE
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Twitter token exchange error:", errorText);
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
          "Failed to exchange authorization code"
        )}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
          "Failed to get user info"
        )}`
      );
    }

    const userData = await userResponse.json();

    // Save Twitter credentials to database
    await saveTwitterCredentials(userId, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      userId: userData.data.id,
      username: userData.data.username,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    // Redirect back to the app with success
    return NextResponse.redirect(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/ai-marketing-agent?success=twitter_connected&username=${encodeURIComponent(
        userData.data.username
      )}`
    );
  } catch (error) {
    console.error("Twitter OAuth callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/ai-marketing-agent?error=twitter_oauth_failed&message=${encodeURIComponent(
        "Failed to complete Twitter OAuth"
      )}`
    );
  }
}

async function saveTwitterCredentials(userEmail: string, credentials: any) {
  await connectDB();

  // In production, create a proper UserSocialAccounts model
  // For now, we'll use a simple approach
  console.log("Saving Twitter credentials for user:", userEmail);
  console.log("Credentials:", credentials);
}
