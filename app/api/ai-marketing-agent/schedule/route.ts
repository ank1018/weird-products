import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import MarketingPost from "../../../../models/MarketingPost";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, platforms, scheduledFor } = await request.json();

    if (!content || !platforms || platforms.length === 0 || !scheduledFor) {
      return NextResponse.json(
        {
          error: "Content, platforms, and scheduled time are required",
        },
        { status: 400 }
      );
    }

    // Validate scheduled time (must be in the future)
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        {
          error: "Scheduled time must be in the future",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create scheduled post
    const marketingPost = new MarketingPost({
      userId: session.user.email,
      content,
      platforms,
      status: "scheduled",
      scheduledFor: scheduledDate,
    });

    await marketingPost.save();

    return NextResponse.json({
      success: true,
      postId: marketingPost._id,
      scheduledFor: scheduledDate,
      message: "Post scheduled successfully",
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get scheduled posts for the user
    const scheduledPosts = await MarketingPost.find({
      userId: session.user.email,
      status: "scheduled",
      scheduledFor: { $gte: new Date() },
    })
      .sort({ scheduledFor: 1 })
      .lean();

    const transformedPosts = scheduledPosts.map((post) => ({
      id: post._id.toString(),
      content: post.content,
      platforms: post.platforms,
      scheduledFor: post.scheduledFor,
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      scheduledPosts: transformedPosts,
    });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled posts" },
      { status: 500 }
    );
  }
}
