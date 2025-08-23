import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import WebsiteAnalysis from "../../../../models/WebsiteAnalysis";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.email;

    await connectDB();

    // Get all analysis history for the user
    const analyses = await WebsiteAnalysis.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50); // Limit to recent 50 analyses

    return NextResponse.json({
      success: true,
      analyses: analyses.map((analysis) => ({
        websiteUrl: analysis.websiteUrl,
        analysis: analysis.analysis,
        recommendations: analysis.recommendations,
        timestamp: analysis.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.email;

    const { websiteUrl, analysis, recommendations } = await request.json();

    if (!websiteUrl || !analysis) {
      return NextResponse.json(
        { error: "Website URL and analysis are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert the analysis (update if exists, insert if new)
    const result = await WebsiteAnalysis.findOneAndUpdate(
      { userId, websiteUrl },
      {
        userId,
        websiteUrl,
        analysis,
        recommendations,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Analysis saved to cloud storage",
      analysis: {
        websiteUrl: result.websiteUrl,
        analysis: result.analysis,
        recommendations: result.recommendations,
        timestamp: result.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error saving analysis to cloud:", error);
    return NextResponse.json(
      { error: "Failed to save analysis to cloud" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.email;

    const { searchParams } = new URL(request.url);
    const websiteUrl = searchParams.get("websiteUrl");

    await connectDB();

    if (websiteUrl) {
      // Delete specific analysis
      await WebsiteAnalysis.deleteOne({ userId, websiteUrl });
      return NextResponse.json({
        success: true,
        message: "Analysis deleted from cloud storage",
      });
    } else {
      // Delete all analyses for the user
      await WebsiteAnalysis.deleteMany({ userId });
      return NextResponse.json({
        success: true,
        message: "All analyses deleted from cloud storage",
      });
    }
  } catch (error) {
    console.error("Error deleting analysis from cloud:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis from cloud" },
      { status: 500 }
    );
  }
}
