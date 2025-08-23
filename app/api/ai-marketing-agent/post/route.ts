import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import MarketingPost from "../../../../models/MarketingPost";

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional for testing)
    const session = await getServerSession();
    const userId = session?.user?.email || "demo-user@example.com";

    const { content, platforms } = await request.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Content and platforms are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Post to each platform
    const postingResults = await Promise.allSettled(
      platforms.map((platform) => postToPlatform(platform, content))
    );

    // Update database with results
    const successCount = postingResults.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const status = successCount > 0 ? "posted" : "failed";

    // Find the latest post for this user and update it
    const latestPost = await MarketingPost.findOne({
      userId: userId,
    }).sort({ createdAt: -1 });

    if (latestPost) {
      latestPost.status = status;
      latestPost.platforms = platforms;
      latestPost.postedAt = status === "posted" ? new Date() : undefined;
      await latestPost.save();
    }

    return NextResponse.json({
      success: true,
      postedTo: successCount,
      totalPlatforms: platforms.length,
      status,
    });
  } catch (error) {
    console.error("Error posting content:", error);
    return NextResponse.json(
      { error: "Failed to post content" },
      { status: 500 }
    );
  }
}

async function postToPlatform(
  platform: string,
  content: string
): Promise<boolean> {
  try {
    switch (platform) {
      case "twitter":
        return await postToTwitter(content);
      case "linkedin":
        return await postToLinkedIn(content);
      case "telegram":
        return await postToTelegram(content);
      default:
        console.warn(`Unknown platform: ${platform}`);
        return false;
    }
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    return false;
  }
}

async function postToTwitter(content: string): Promise<boolean> {
  // For MVP, we'll simulate posting to Twitter
  // In production, you would integrate with Twitter API v2
  console.log("Posting to Twitter:", content);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return success (in production, check actual API response)
  return true;
}

async function postToLinkedIn(content: string): Promise<boolean> {
  // For MVP, we'll simulate posting to LinkedIn
  // In production, you would integrate with LinkedIn API
  console.log("Posting to LinkedIn:", content);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return success (in production, check actual API response)
  return true;
}

async function postToTelegram(content: string): Promise<boolean> {
  // For MVP, we'll simulate posting to Telegram
  // In production, you would integrate with Telegram Bot API
  console.log("Posting to Telegram:", content);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, return success (in production, check actual API response)
  return true;
}
