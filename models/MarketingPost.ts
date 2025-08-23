import mongoose from "mongoose";

const marketingPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    enum: ["social-post", "blog-post", "product-description", "newsletter"],
    default: "social-post",
  },
  tone: {
    type: String,
    enum: ["professional", "casual", "friendly", "enthusiastic"],
    default: "professional",
  },
  platforms: [
    {
      type: String,
      enum: ["twitter", "linkedin", "telegram"],
    },
  ],
  status: {
    type: String,
    enum: ["draft", "scheduled", "posted", "failed"],
    default: "draft",
  },
  scheduledFor: {
    type: Date,
  },
  postedAt: {
    type: Date,
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
marketingPostSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.MarketingPost ||
  mongoose.model("MarketingPost", marketingPostSchema);
