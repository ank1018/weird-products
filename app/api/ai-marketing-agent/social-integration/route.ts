import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

// Social Media API Integrations
interface SocialMediaConfig {
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
  linkedin: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
  };
  telegram: {
    botToken: string;
    channelId: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.user?.email || "demo-user@example.com";

    const { content, platforms, aiRecommendations } = await request.json();

    console.log("Received platforms:", platforms);
    console.log("Platforms type:", typeof platforms);
    console.log("Platforms length:", platforms?.length);

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Content and platforms are required" },
        { status: 400 }
      );
    }

    const results = {
      success: [] as string[],
      failed: [] as string[],
      details: {} as Record<string, any>,
    };

    // Post to each selected platform
    for (const platform of platforms) {
      try {
        const result = await postToPlatform(
          platform,
          content,
          aiRecommendations
        );
        if (result.success) {
          results.success.push(platform);
          results.details[platform] = result;
        } else {
          results.failed.push(platform);
          results.details[platform] = result;
        }
      } catch (error) {
        console.error(`Error posting to ${platform}:`, error);
        results.failed.push(platform);
        results.details[platform] = { error: error.message };
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Posted to ${results.success.length} platforms successfully`,
    });
  } catch (error) {
    console.error("Error in social media integration:", error);
    return NextResponse.json(
      { error: "Failed to post to social media" },
      { status: 500 }
    );
  }
}

async function postToPlatform(
  platform: string,
  content: string,
  aiRecommendations?: any
) {
  // Normalize platform name to lowercase
  const normalizedPlatform = platform.toLowerCase();

  console.log(
    `Attempting to post to platform: ${platform} (normalized: ${normalizedPlatform})`
  );

  switch (normalizedPlatform) {
    case "twitter":
      return await postToTwitter(content, aiRecommendations);
    case "linkedin":
      return await postToLinkedIn(content, aiRecommendations);
    case "telegram":
      return await postToTelegram(content, aiRecommendations);
    case "reddit":
      return await postToReddit(content, aiRecommendations);
    case "hackernews":
      return await postToHackerNews(content, aiRecommendations);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function postToTwitter(content: string, aiRecommendations?: any) {
  try {
    // In production, get user's connected Twitter credentials from database
    // For now, we'll use environment variables as fallback
    const twitterCredentials = process.env.TWITTER_API_KEY
      ? {
          apiKey: process.env.TWITTER_API_KEY,
          apiSecret: process.env.TWITTER_API_SECRET,
          accessToken: process.env.TWITTER_ACCESS_TOKEN,
          accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        }
      : null;

    if (!twitterCredentials) {
      return {
        success: false,
        error: "Twitter account not connected",
        message:
          "Please connect your Twitter account in the Social Media Connection section",
      };
    }

    // In production, use the Twitter API v2
    // For now, we'll simulate the API call
    const tweetData = {
      text: content.substring(0, 280), // Twitter character limit
      // Add media attachments if needed
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      platform: "twitter",
      postId: `tweet_${Date.now()}`,
      url: `https://twitter.com/user/status/${Date.now()}`,
      message: "Tweet posted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      platform: "twitter",
    };
  }
}

async function postToLinkedIn(content: string, aiRecommendations?: any) {
  try {
    // In production, get user's connected LinkedIn credentials from database
    // For now, we'll use environment variables as fallback
    const linkedInCredentials = process.env.LINKEDIN_CLIENT_ID
      ? {
          clientId: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
          personId: process.env.LINKEDIN_PERSON_ID,
        }
      : null;

    if (!linkedInCredentials) {
      return {
        success: false,
        error: "LinkedIn account not connected",
        message:
          "Please connect your LinkedIn account in the Social Media Connection section",
      };
    }

    // LinkedIn API v2 UGC Posts
    const linkedInData = {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      platform: "linkedin",
      postId: `linkedin_${Date.now()}`,
      url: `https://linkedin.com/feed/update/${Date.now()}`,
      message: "LinkedIn post published successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      platform: "linkedin",
    };
  }
}

async function postToTelegram(content: string, aiRecommendations?: any) {
  try {
    // Get user's Telegram credentials from the request context
    // In production, this would be passed from the main function
    const session = await getServerSession();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
        platform: "telegram",
      };
    }

    // In production, get user's Telegram credentials from database
    // For now, we'll use a simple approach to get user credentials
    await connectDB();
    
    // TODO: Implement proper database lookup for user's Telegram credentials
    // For now, we'll use environment variables as fallback
    const telegramCredentials = process.env.TELEGRAM_BOT_TOKEN
      ? {
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          channelId: process.env.TELEGRAM_CHANNEL_ID || "@your_channel",
        }
      : null;

    if (!telegramCredentials) {
      return {
        success: false,
        error: "Telegram bot not connected",
        message:
          "Please connect your Telegram bot in the Social Media Connection section",
        platform: "telegram",
      };
    }

    const { botToken, channelId } = telegramCredentials;

    console.log(`Telegram posting attempt:`, {
      botToken: botToken ? "***" : "not set",
      channelId,
      contentLength: content.length,
    });

    // Format content for Telegram
    const telegramContent = formatTelegramContent(content, aiRecommendations);

    // Real Telegram API call
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: telegramContent,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Telegram API error:", errorData);
      throw new Error(`Telegram API error: ${response.status} - ${errorData.description || 'Unknown error'}`);
    }

    const result = await response.json();

    return {
      success: true,
      platform: "telegram",
      postId: result.result?.message_id?.toString(),
      url: `https://t.me/${channelId.replace("@", "")}/${
        result.result?.message_id
      }`,
      message: "Telegram message sent successfully",
      groups: aiRecommendations?.telegramGroups || [],
    };
  } catch (error) {
    console.error("Telegram posting error:", error);
    return {
      success: false,
      error: error.message,
      platform: "telegram",
    };
  }
}

async function postToReddit(content: string, aiRecommendations?: any) {
  try {
    // Reddit API integration would require OAuth2 authentication
    // For now, we'll simulate the process
    return {
      success: false,
      error: "Reddit integration requires OAuth2 setup",
      message:
        "Reddit integration is available but requires additional OAuth2 configuration",
      platform: "reddit",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      platform: "reddit",
    };
  }
}

async function postToHackerNews(content: string, aiRecommendations?: any) {
  try {
    // Hacker News doesn't have a public API for posting
    // Users would need to manually submit
    return {
      success: false,
      error: "Hacker News requires manual submission",
      message:
        "Hacker News submissions must be done manually at https://news.ycombinator.com/submit",
      platform: "hackernews",
      manualUrl: "https://news.ycombinator.com/submit",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      platform: "hackernews",
    };
  }
}

function formatTelegramContent(content: string, aiRecommendations?: any) {
  // Format content specifically for Telegram
  let formattedContent = content;

  // Add emojis and formatting for better engagement
  if (
    aiRecommendations?.contentType === "product" ||
    aiRecommendations?.contentType === "tool"
  ) {
    formattedContent = `🚀 ${formattedContent}`;
  }

  // Add hashtags if available
  if (aiRecommendations?.hashtags && aiRecommendations.hashtags.length > 0) {
    formattedContent += `\n\n${aiRecommendations.hashtags.join(" ")}`;
  }

  // Add call to action
  formattedContent += "\n\n👉 Check it out and let us know what you think!";

  return formattedContent;
}

// Configuration endpoint for setting up social media accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");

    if (!platform) {
      return NextResponse.json(
        { error: "Platform parameter is required" },
        { status: 400 }
      );
    }

    const config = getPlatformConfig(platform);

    return NextResponse.json({
      success: true,
      platform,
      config,
      setupInstructions: getSetupInstructions(platform),
    });
  } catch (error) {
    console.error("Error getting platform config:", error);
    return NextResponse.json(
      { error: "Failed to get platform configuration" },
      { status: 500 }
    );
  }
}

function getPlatformConfig(platform: string) {
  switch (platform) {
    case "twitter":
      return {
        required: [
          "TWITTER_API_KEY",
          "TWITTER_API_SECRET",
          "TWITTER_ACCESS_TOKEN",
          "TWITTER_ACCESS_TOKEN_SECRET",
        ],
        optional: ["TWITTER_BEARER_TOKEN"],
        setupUrl: "https://developer.twitter.com/en/portal/dashboard",
      };
    case "linkedin":
      return {
        required: [
          "LINKEDIN_CLIENT_ID",
          "LINKEDIN_CLIENT_SECRET",
          "LINKEDIN_ACCESS_TOKEN",
        ],
        optional: ["LINKEDIN_PERSON_ID"],
        setupUrl: "https://www.linkedin.com/developers/",
      };
    case "telegram":
      return {
        required: ["TELEGRAM_BOT_TOKEN"],
        optional: ["TELEGRAM_CHANNEL_ID"],
        setupUrl: "https://core.telegram.org/bots#how-do-i-create-a-bot",
      };
    default:
      return {
        required: [],
        optional: [],
        setupUrl: null,
      };
  }
}

function getSetupInstructions(platform: string) {
  switch (platform) {
    case "twitter":
      return {
        steps: [
          "1. Go to Twitter Developer Portal",
          "2. Create a new app",
          "3. Generate API keys and access tokens",
          "4. Add environment variables to your .env.local file",
          "5. Ensure your app has write permissions",
        ],
        notes: [
          "Twitter API v2 is required for posting",
          "Your app must be approved for write access",
          "Rate limits apply: 300 tweets per 3 hours",
        ],
      };
    case "linkedin":
      return {
        steps: [
          "1. Go to LinkedIn Developers",
          "2. Create a new app",
          "3. Request access to Marketing Developer Platform",
          "4. Generate access tokens",
          "5. Add environment variables to your .env.local file",
        ],
        notes: [
          "LinkedIn Marketing Developer Platform access required",
          "Posts are subject to LinkedIn's content policies",
          "Rate limits apply based on your app tier",
        ],
      };
    case "telegram":
      return {
        steps: [
          "1. Message @BotFather on Telegram",
          "2. Create a new bot with /newbot command",
          "3. Get your bot token",
          "4. Add bot to your channel as admin",
          "5. Add environment variables to your .env.local file",
        ],
        notes: [
          "Bot must be admin of the channel to post",
          "Channel ID format: @channelname or -100xxxxxxxxx",
          "No rate limits for bot messages",
        ],
      };
    default:
      return {
        steps: [],
        notes: [],
      };
  }
}
