import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        message: 'Please sign in to connect social media accounts',
        requiresAuth: true 
      }, { status: 401 });
    }
    const userId = session.user.email;

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "setup") {
      // Provide Telegram bot setup instructions
      return NextResponse.json({
        success: true,
        setupInstructions: {
          steps: [
            "1. Open Telegram and search for @BotFather",
            "2. Send /newbot command",
            '3. Choose a name for your bot (e.g., "My Marketing Bot")',
            '4. Choose a username for your bot (must end with "bot", e.g., "mymarketingbot")',
            "5. Copy the bot token provided by BotFather",
            "6. Add the bot to your channel as an administrator",
            "7. Note your channel username (e.g., @mychannel)",
          ],
          botTokenPlaceholder: "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
          channelPlaceholder: "@your_channel_name",
        },
      });
    }

    if (action === "connect") {
      const { botToken, channelId } = await request.json();

      if (!botToken || !channelId) {
        return NextResponse.json(
          {
            error: "Bot token and channel ID are required",
          },
          { status: 400 }
        );
      }

      // Test the bot token and channel access
      const testResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`
      );

      if (!testResponse.ok) {
        return NextResponse.json(
          {
            error:
              "Invalid bot token. Please check your bot token and try again.",
          },
          { status: 400 }
        );
      }

      const botInfo = await testResponse.json();

      // Test sending a message to the channel
      const testMessageResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channelId,
            text: "🤖 Bot connection test successful! Your AI Marketing Agent is now connected.",
            parse_mode: "HTML",
          }),
        }
      );

      if (!testMessageResponse.ok) {
        return NextResponse.json(
          {
            error:
              "Cannot send message to channel. Make sure the bot is an administrator of the channel.",
          },
          { status: 400 }
        );
      }

      // Save Telegram credentials
      await saveTelegramCredentials(userId, {
        botToken,
        channelId,
        botUsername: botInfo.result.username,
        botName: botInfo.result.first_name,
        connectedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Telegram bot connected successfully!",
        bot: {
          username: botInfo.result.username,
          name: botInfo.result.first_name,
          channelId,
        },
      });
    }

    if (action === "disconnect") {
      await disconnectTelegramAccount(userId);
      return NextResponse.json({
        success: true,
        message: "Telegram bot disconnected",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Telegram integration error:", error);
    return NextResponse.json(
      { error: "Failed to process Telegram integration" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Authentication required', 
        message: 'Please sign in to connect social media accounts',
        requiresAuth: true 
      }, { status: 401 });
    }
    const userId = session.user.email;

    const { botToken, channelId } = await request.json();

    if (!botToken || !channelId) {
      return NextResponse.json(
        {
          error: "Bot token and channel ID are required",
        },
        { status: 400 }
      );
    }

    // Validate bot token
    const botResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );

    if (!botResponse.ok) {
      return NextResponse.json(
        {
          error: "Invalid bot token",
        },
        { status: 400 }
      );
    }

    const botInfo = await botResponse.json();

    // Test channel access
    const channelResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: "🔗 Testing channel connection...",
          parse_mode: "HTML",
        }),
      }
    );

    if (!channelResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Cannot access channel. Make sure the bot is an administrator.",
        },
        { status: 400 }
      );
    }

    // Save credentials
    await saveTelegramCredentials(userId, {
      botToken,
      channelId,
      botUsername: botInfo.result.username,
      botName: botInfo.result.first_name,
      connectedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Telegram bot connected successfully!",
      bot: {
        username: botInfo.result.username,
        name: botInfo.result.first_name,
        channelId,
      },
    });
  } catch (error) {
    console.error("Telegram connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect Telegram bot" },
      { status: 500 }
    );
  }
}

async function saveTelegramCredentials(userEmail: string, credentials: any) {
  await connectDB();

  // In production, create a proper UserSocialAccounts model
  console.log("Saving Telegram credentials for user:", userEmail);
  console.log("Credentials:", credentials);
}

async function disconnectTelegramAccount(userEmail: string) {
  await connectDB();

  // Remove Telegram credentials from database
  console.log("Disconnecting Telegram account for user:", userEmail);
}
