import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { message, channelId, botToken } = await request.json();

    if (!message || !channelId || !botToken) {
      return NextResponse.json(
        { error: "Message, channel ID, and bot token are required" },
        { status: 400 }
      );
    }

    // Send message to Telegram channel
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Telegram API error:", errorData);

      return NextResponse.json(
        {
          error: "Failed to send message to Telegram",
          details: errorData.description || "Unknown error",
        },
        { status: 400 }
      );
    }

    const result = await telegramResponse.json();

    return NextResponse.json({
      success: true,
      message: "Message sent to Telegram successfully",
      messageId: result.result.message_id,
      chatId: result.result.chat.id,
    });
  } catch (error) {
    console.error("Telegram posting error:", error);
    return NextResponse.json(
      { error: "Failed to send message to Telegram" },
      { status: 500 }
    );
  }
}
