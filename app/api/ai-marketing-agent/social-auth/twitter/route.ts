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
console.log("Twitter OAuth Configuration:");
console.log("TWITTER_CLIENT_ID:", TWITTER_CLIENT_ID);
console.log(
  "TWITTER_CLIENT_SECRET:",
  TWITTER_CLIENT_SECRET ? "SET" : "NOT SET"
);
console.log("REDIRECT_URI:", REDIRECT_URI);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please sign in to connect social media accounts",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }
    const userId = session.user.email;

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "connect") {
      // Generate Twitter OAuth URL
      const state = Math.random().toString(36).substring(7);
      const authUrl =
        `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${TWITTER_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=tweet.read%20tweet.write%20users.read%20offline.access&` +
        `state=${state}`;

      console.log("Generated Twitter OAuth URL:", authUrl);
      console.log("Using Client ID:", TWITTER_CLIENT_ID);
      console.log("Redirect URI:", REDIRECT_URI);
      console.log("Scopes: tweet.read tweet.write users.read offline.access");

      return NextResponse.json({
        success: true,
        authUrl,
        state,
      });
    }

    if (action === "disconnect") {
      // Disconnect Twitter account
      await disconnectTwitterAccount(userId);
      return NextResponse.json({
        success: true,
        message: "Twitter account disconnected",
      });
    }

    if (action === "verify") {
      // Check if Twitter account is connected
      const isConnected = await checkTwitterConnection(userId);
      return NextResponse.json({
        connected: isConnected.connected,
        username: isConnected.username,
        message: isConnected.connected
          ? "Twitter account is connected"
          : "Twitter account not connected",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Twitter OAuth error:", error);
    return NextResponse.json(
      { error: "Failed to process Twitter OAuth" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please sign in to connect social media accounts",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }
    const userId = session.user.email;

    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code required" },
        { status: 400 }
      );
    }

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
      const error = await tokenResponse.text();
      console.error("Twitter token exchange error:", error);
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
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
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 400 }
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

    return NextResponse.json({
      success: true,
      message: "Twitter account connected successfully",
      user: {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
      },
    });
  } catch (error) {
    console.error("Twitter OAuth callback error:", error);
    return NextResponse.json(
      { error: "Failed to complete Twitter OAuth" },
      { status: 500 }
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

async function disconnectTwitterAccount(userEmail: string) {
  await connectDB();

  // Remove Twitter credentials from database
  console.log("Disconnecting Twitter account for user:", userEmail);
}

async function checkTwitterConnection(userEmail: string) {
  await connectDB();

  // In production, check database for stored credentials
  // For now, we'll simulate checking connection status
  // This should check if valid credentials exist in the database
  console.log("Checking Twitter connection for user:", userEmail);

  // For demo purposes, return false (not connected)
  // In production, this would check the database for valid credentials
  return {
    connected: false,
    username: null,
  };
}
