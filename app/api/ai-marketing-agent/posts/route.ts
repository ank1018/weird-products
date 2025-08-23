import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import MarketingPost from "../../../../models/MarketingPost";

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional for testing)
    const session = await getServerSession();
    const userId = session?.user?.email || "demo-user@example.com";

    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status");

    // Build query
    const query: any = { userId: userId };
    if (status) {
      query.status = status;
    }

    // Fetch posts with pagination
    const posts = await MarketingPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await MarketingPost.countDocuments(query);

    // Transform posts for frontend
    const transformedPosts = posts.map((post) => ({
      id: post._id.toString(),
      content: post.content,
      websiteUrl: post.websiteUrl,
      contentType: post.contentType,
      tone: post.tone,
      platforms: post.platforms || [],
      status: post.status,
      scheduledFor: post.scheduledFor,
      postedAt: post.postedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication (optional for testing)
    const session = await getServerSession();
    const userId = session?.user?.email || "demo-user@example.com";

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete the post (only if it belongs to the user)
    const result = await MarketingPost.deleteOne({
      _id: postId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
