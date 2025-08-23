import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID =
  process.env.LINKEDIN_CLIENT_ID || "your_linkedin_client_id";
const LINKEDIN_CLIENT_SECRET =
  process.env.LINKEDIN_CLIENT_SECRET || "your_linkedin_client_secret";
const REDIRECT_URI = `${
  process.env.NEXTAUTH_URL || "http://localhost:3000"
}/api/ai-marketing-agent/social-auth/linkedin/callback`;

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
      // Generate LinkedIn OAuth URL
      const state = Math.random().toString(36).substring(7);
      const authUrl =
        `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${LINKEDIN_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=r_liteprofile%20r_emailaddress%20w_member_social&` +
        `state=${state}`;

      return NextResponse.json({
        success: true,
        authUrl,
        state,
      });
    }

    if (action === "disconnect") {
      // Disconnect LinkedIn account
      await disconnectLinkedInAccount(userId);
      return NextResponse.json({
        success: true,
        message: "LinkedIn account disconnected",
      });
    }

    if (action === "verify") {
      // Check if LinkedIn account is connected
      const isConnected = await checkLinkedInConnection(userId);
      return NextResponse.json({
        connected: isConnected.connected,
        name: isConnected.name,
        message: isConnected.connected
          ? "LinkedIn account is connected"
          : "LinkedIn account not connected",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("LinkedIn OAuth error:", error);
    return NextResponse.json(
      { error: "Failed to process LinkedIn OAuth" },
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
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("LinkedIn token exchange error:", error);
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user profile
    const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user profile" },
        { status: 400 }
      );
    }

    const profileData = await profileResponse.json();

    // Save LinkedIn credentials to database
    await saveLinkedInCredentials(userId, {
      accessToken: tokenData.access_token,
      userId: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    return NextResponse.json({
      success: true,
      message: "LinkedIn account connected successfully",
      user: {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
      },
    });
  } catch (error) {
    console.error("LinkedIn OAuth callback error:", error);
    return NextResponse.json(
      { error: "Failed to complete LinkedIn OAuth" },
      { status: 500 }
    );
  }
}

async function saveLinkedInCredentials(userEmail: string, credentials: any) {
  await connectDB();

  // In production, create a proper UserSocialAccounts model
  console.log("Saving LinkedIn credentials for user:", userEmail);
  console.log("Credentials:", credentials);
}

async function disconnectLinkedInAccount(userEmail: string) {
  await connectDB();

  // Remove LinkedIn credentials from database
  console.log("Disconnecting LinkedIn account for user:", userEmail);
}

async function checkLinkedInConnection(userEmail: string) {
  await connectDB();

  // In production, check database for stored credentials
  // For now, we'll simulate checking connection status
  // This should check if valid credentials exist in the database
  console.log("Checking LinkedIn connection for user:", userEmail);

  // For demo purposes, return false (not connected)
  // In production, this would check the database for valid credentials
  return {
    connected: false,
    name: null,
  };
}
