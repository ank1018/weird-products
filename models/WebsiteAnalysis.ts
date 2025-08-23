import mongoose from "mongoose";

const websiteAnalysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  analysis: {
    title: String,
    description: String,
    keywords: [String],
    category: String,
    targetAudience: [String],
    contentType: {
      type: String,
      enum: ["product", "service", "blog", "news", "tool"],
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },
    trendingTopics: [String],
  },
  recommendations: {
    suggestedPlatforms: [String],
    bestTimeToPost: String,
    targetAudience: [String],
    hashtags: [String],
    tone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
websiteAnalysisSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create compound index for efficient queries
websiteAnalysisSchema.index({ userId: 1, websiteUrl: 1 });

export default mongoose.models.WebsiteAnalysis ||
  mongoose.model("WebsiteAnalysis", websiteAnalysisSchema);
