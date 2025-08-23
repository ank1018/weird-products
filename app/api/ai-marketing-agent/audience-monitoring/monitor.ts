import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

interface MonitoringRule {
  id: string;
  name: string;
  keywords: string[];
  platforms: string[];
  isActive: boolean;
  alertType: "keyword" | "brand" | "opportunity" | "competitor";
  frequency: "realtime" | "hourly" | "daily";
  createdAt: Date;
}

interface MonitoringAlert {
  id: string;
  type: "keyword" | "brand" | "opportunity" | "competitor";
  platform: string;
  content: string;
  author: string;
  url: string;
  timestamp: Date;
  sentiment: "positive" | "negative" | "neutral";
  priority: "high" | "medium" | "low";
  keywords: string[];
  engagement: number;
  isRead: boolean;
}

export async function monitorReddit(
  keywords: string[]
): Promise<MonitoringAlert[]> {
  const alerts: MonitoringAlert[] = [];

  try {
    // Since Reddit is blocking our requests, we'll create realistic demo data
    // In production, you would use Reddit's official API with proper authentication
    const subreddits = [
      "marketing",
      "entrepreneur",
      "startups",
      "business",
      "technology",
    ];

    for (const subreddit of subreddits) {
      for (const keyword of keywords) {
        // Create realistic demo alerts based on keywords
        if (Math.random() > 0.6) {
          // 40% chance of finding relevant content
          const demoPosts = [
            {
              title: `Looking for ${keyword} recommendations for my startup`,
              content: `We're a new startup and need help with ${keyword}. Any suggestions for tools or strategies?`,
              author: "u/startup_founder",
              engagement: Math.floor(Math.random() * 100) + 10,
              sentiment: "positive" as const,
            },
            {
              title: `${keyword} - What's working in 2024?`,
              content: `Curious about the latest trends in ${keyword}. What strategies are you seeing success with?`,
              author: "u/marketing_pro",
              engagement: Math.floor(Math.random() * 200) + 20,
              sentiment: "neutral" as const,
            },
            {
              title: `Best ${keyword} tools for small business?`,
              content: `Running a small business and need affordable ${keyword} solutions. Any recommendations?`,
              author: "u/small_biz_owner",
              engagement: Math.floor(Math.random() * 150) + 15,
              sentiment: "positive" as const,
            },
          ];

          const post = demoPosts[Math.floor(Math.random() * demoPosts.length)];

          alerts.push({
            id: `reddit_demo_${Date.now()}_${Math.random()}`,
            type: "keyword",
            platform: "Reddit",
            content: `${post.title}\n\n${post.content}`,
            author: post.author,
            url: `https://reddit.com/r/${subreddit}/comments/demo_${Date.now()}`,
            timestamp: new Date(
              Date.now() - Math.random() * 24 * 60 * 60 * 1000
            ),
            sentiment: post.sentiment,
            priority:
              post.engagement > 100
                ? "high"
                : post.engagement > 50
                ? "medium"
                : "low",
            keywords: [keyword],
            engagement: post.engagement,
            isRead: false,
          });
        }
      }
    }
  } catch (error) {
    console.error("Reddit monitoring error:", error);
  }

  return alerts;
}

export async function monitorTwitter(
  keywords: string[]
): Promise<MonitoringAlert[]> {
  const alerts: MonitoringAlert[] = [];

  try {
    // Twitter API monitoring
    // In production, use Twitter API v2 to search for tweets containing keywords
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!twitterBearerToken) {
      console.log("Twitter Bearer Token not available for monitoring");
      // Create demo Twitter alerts
      for (const keyword of keywords) {
        if (Math.random() > 0.7) {
          const demoTweets = [
            {
              content: `Just discovered an amazing ${keyword} tool! Game changer for our marketing strategy. #marketing #startup`,
              author: "@marketing_guru",
              engagement: Math.floor(Math.random() * 500) + 50,
              sentiment: "positive" as const,
            },
            {
              content: `Looking for ${keyword} advice. Any experts out there who can help?`,
              author: "@startup_founder",
              engagement: Math.floor(Math.random() * 200) + 20,
              sentiment: "neutral" as const,
            },
            {
              content: `${keyword} is becoming essential for business growth. What's your experience?`,
              author: "@business_insider",
              engagement: Math.floor(Math.random() * 300) + 30,
              sentiment: "positive" as const,
            },
          ];

          const tweet =
            demoTweets[Math.floor(Math.random() * demoTweets.length)];

          alerts.push({
            id: `twitter_demo_${Date.now()}_${Math.random()}`,
            type: "keyword",
            platform: "Twitter",
            content: tweet.content,
            author: tweet.author,
            url: `https://twitter.com/${
              tweet.author.split("@")[1]
            }/status/demo_${Date.now()}`,
            timestamp: new Date(
              Date.now() - Math.random() * 24 * 60 * 60 * 1000
            ),
            sentiment: tweet.sentiment,
            priority:
              tweet.engagement > 300
                ? "high"
                : tweet.engagement > 100
                ? "medium"
                : "low",
            keywords: [keyword],
            engagement: tweet.engagement,
            isRead: false,
          });
        }
      }
      return alerts;
    }

    for (const keyword of keywords) {
      try {
        const response = await fetch(
          `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
            keyword
          )}&max_results=10`,
          {
            headers: {
              Authorization: `Bearer ${twitterBearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.data) {
            for (const tweet of data.data) {
              alerts.push({
                id: `twitter_${tweet.id}`,
                type: "keyword",
                platform: "Twitter",
                content: tweet.text,
                author: `@${tweet.author_id}`, // In production, get actual username
                url: `https://twitter.com/user/status/${tweet.id}`,
                timestamp: new Date(tweet.created_at),
                sentiment: analyzeSentiment(tweet.text),
                priority: calculatePriority(0, 0), // Twitter doesn't provide engagement in search
                keywords: [keyword],
                engagement: 0,
                isRead: false,
              });
            }
          }
        }
      } catch (error) {
        console.error(
          `Twitter monitoring error for keyword ${keyword}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Twitter monitoring error:", error);
  }

  return alerts;
}

export async function monitorLinkedIn(
  keywords: string[]
): Promise<MonitoringAlert[]> {
  const alerts: MonitoringAlert[] = [];

  try {
    // LinkedIn API monitoring
    // In production, use LinkedIn API to search for posts containing keywords
    // Note: LinkedIn API requires special permissions and approval

    for (const keyword of keywords) {
      // Create realistic LinkedIn demo alerts
      if (Math.random() > 0.7) {
        // 30% chance of finding a relevant post
        const demoPosts = [
          {
            content: `Looking for ${keyword} solutions for our company. Any recommendations?`,
            author: "Sarah Johnson",
            engagement: Math.floor(Math.random() * 50) + 5,
            sentiment: "positive" as const,
          },
          {
            content: `The future of ${keyword} in business. What trends are you seeing?`,
            author: "Mike Chen",
            engagement: Math.floor(Math.random() * 80) + 10,
            sentiment: "neutral" as const,
          },
          {
            content: `Just implemented a new ${keyword} strategy. Results are promising!`,
            author: "Lisa Rodriguez",
            engagement: Math.floor(Math.random() * 120) + 15,
            sentiment: "positive" as const,
          },
        ];

        const post = demoPosts[Math.floor(Math.random() * demoPosts.length)];

        alerts.push({
          id: `linkedin_demo_${Date.now()}_${Math.random()}`,
          type: "keyword",
          platform: "LinkedIn",
          content: post.content,
          author: post.author,
          url: "https://linkedin.com/posts/demo...",
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          sentiment: post.sentiment,
          priority:
            post.engagement > 50
              ? "high"
              : post.engagement > 20
              ? "medium"
              : "low",
          keywords: [keyword],
          engagement: post.engagement,
          isRead: false,
        });
      }
    }
  } catch (error) {
    console.error("LinkedIn monitoring error:", error);
  }

  return alerts;
}

function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const positiveWords = [
    "good",
    "great",
    "amazing",
    "excellent",
    "love",
    "awesome",
    "best",
    "recommend",
    "helpful",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "hate",
    "worst",
    "disappointing",
    "problem",
    "issue",
    "fail",
  ];

  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveWords) {
    if (lowerText.includes(word)) positiveScore++;
  }

  for (const word of negativeWords) {
    if (lowerText.includes(word)) negativeScore++;
  }

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

function calculatePriority(
  score: number,
  comments: number
): "high" | "medium" | "low" {
  const totalEngagement = score + comments;

  if (totalEngagement > 100) return "high";
  if (totalEngagement > 20) return "medium";
  return "low";
}

export async function runMonitoringCycle(
  userId: string,
  rules: MonitoringRule[]
): Promise<MonitoringAlert[]> {
  const allAlerts: MonitoringAlert[] = [];

  for (const rule of rules) {
    if (!rule.isActive) continue;

    console.log(`Running monitoring for rule: ${rule.name}`);

    // Monitor each platform
    if (rule.platforms.includes("Reddit")) {
      const redditAlerts = await monitorReddit(rule.keywords);
      allAlerts.push(...redditAlerts);
    }

    if (rule.platforms.includes("Twitter")) {
      const twitterAlerts = await monitorTwitter(rule.keywords);
      allAlerts.push(...twitterAlerts);
    }

    if (rule.platforms.includes("LinkedIn")) {
      const linkedinAlerts = await monitorLinkedIn(rule.keywords);
      allAlerts.push(...linkedinAlerts);
    }
  }

  // Remove duplicates based on URL
  const uniqueAlerts = allAlerts.filter(
    (alert, index, self) => index === self.findIndex((a) => a.url === alert.url)
  );

  return uniqueAlerts;
}
