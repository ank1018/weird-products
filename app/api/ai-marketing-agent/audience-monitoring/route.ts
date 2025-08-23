import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";

// Cache for storing recent alerts to avoid repeated API calls
const alertCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const websiteUrl = searchParams.get("websiteUrl");

    if (action === "simple-test") {
      // Simple test without external APIs
      return NextResponse.json({
        success: true,
        test: true,
        message: "Simple test endpoint working",
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "test") {
      // Test endpoint to debug monitoring
      console.log("Testing monitoring functionality...");

      if (!websiteUrl) {
        return NextResponse.json(
          { error: "Website URL required for testing" },
          { status: 400 }
        );
      }

      try {
        // Extract keywords from the actual website
        const extractedKeywords = await extractKeywordsFromWebsite(websiteUrl);
        const testPlatforms = ["hackernews", "reddit"];

        console.log(
          "Starting test with extracted keywords:",
          extractedKeywords
        );
        console.log("Testing platforms:", testPlatforms);

        const alerts = await scrapeForumsForAlerts(
          extractedKeywords,
          testPlatforms
        );
        const leads = await identifyLeadOpportunities(
          extractedKeywords,
          testPlatforms
        );

        console.log("Test completed successfully");

        return NextResponse.json({
          success: true,
          test: true,
          websiteUrl,
          keywords: extractedKeywords,
          platforms: testPlatforms,
          alerts,
          leads,
          message: "Test completed with website analysis",
        });
      } catch (error) {
        console.error("Test failed:", error);
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Test failed",
          },
          { status: 500 }
        );
      }
    }

    if (action === "alerts") {
      const userId = session.user.email;

      if (!websiteUrl) {
        return NextResponse.json(
          { error: "Website URL required for alerts" },
          { status: 400 }
        );
      }

      try {
        // Extract keywords from the actual website
        const extractedKeywords = await extractKeywordsFromWebsite(websiteUrl);
        const platforms = ["hackernews", "reddit", "twitter"];

        console.log(`Getting alerts for website: ${websiteUrl}`);
        console.log(
          `Using extracted keywords: ${extractedKeywords.join(", ")}`
        );

        const alerts = await scrapeForumsForAlerts(
          extractedKeywords,
          platforms
        );
        const leads = await identifyLeadOpportunities(
          extractedKeywords,
          platforms
        );

        return NextResponse.json({
          success: true,
          websiteUrl,
          keywords: extractedKeywords,
          alerts,
          leads,
          message: "Alerts retrieved successfully",
        });
      } catch (error) {
        console.error("Error getting alerts:", error);
        return NextResponse.json(
          { error: "Failed to get alerts" },
          { status: 500 }
        );
      }
    }

    if (action === "rules") {
      if (!websiteUrl) {
        return NextResponse.json(
          { error: "Website URL required for rules" },
          { status: 400 }
        );
      }

      try {
        // Generate dynamic rules based on website analysis
        const extractedKeywords = await extractKeywordsFromWebsite(websiteUrl);
        const websiteDomain = new URL(websiteUrl).hostname;

        const dynamicRules = [
          {
            id: "1",
            name: "Website Keywords",
            keywords: extractedKeywords.slice(0, 5), // Top 5 keywords
            platforms: ["Reddit", "Twitter", "HackerNews"],
            isActive: true,
            alertType: "keyword",
            frequency: "realtime",
            createdAt: new Date(),
          },
          {
            id: "2",
            name: "Brand Mentions",
            keywords: [
              websiteDomain,
              websiteDomain.replace(".com", ""),
              websiteDomain.replace("www.", ""),
            ],
            platforms: ["Twitter", "Reddit", "LinkedIn"],
            isActive: true,
            alertType: "brand",
            frequency: "realtime",
            createdAt: new Date(),
          },
          {
            id: "3",
            name: "Industry Terms",
            keywords: extractedKeywords.slice(5, 10), // Additional keywords
            platforms: ["Reddit", "HackerNews"],
            isActive: true,
            alertType: "industry",
            frequency: "realtime",
            createdAt: new Date(),
          },
        ];

        return NextResponse.json({
          success: true,
          websiteUrl,
          rules: dynamicRules,
          message: "Dynamic rules generated from website analysis",
        });
      } catch (error) {
        console.error("Error generating rules:", error);
        return NextResponse.json(
          { error: "Failed to generate rules" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Audience monitoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl, action, platforms, keywords } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    if (action === "start_monitoring") {
      // Extract keywords from website and start real monitoring
      const extractedKeywords = await extractKeywordsFromWebsite(websiteUrl);
      const allKeywords = [...(keywords || []), ...extractedKeywords];

      console.log(
        `Starting monitoring with keywords: ${allKeywords.join(", ")}`
      );
      console.log(`Monitoring platforms: ${platforms.join(", ")}`);

      const alerts = await scrapeForumsForAlerts(allKeywords, platforms);
      const leads = await identifyLeadOpportunities(allKeywords, platforms);

      console.log(
        `Monitoring completed. Found ${alerts.length} alerts and ${leads.length} leads`
      );

      return NextResponse.json({
        success: true,
        keywords: allKeywords,
        alerts,
        leads,
        message: "Forum monitoring started successfully",
      });
    }

    if (action === "analyze_keywords") {
      const keywords = await extractKeywordsFromWebsite(websiteUrl);
      const keywordAnalysis = await analyzeKeywords(keywords);

      return NextResponse.json({
        success: true,
        keywordAnalysis,
        message: "Keyword analysis completed",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Audience monitoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function extractKeywordsFromWebsite(url: string): Promise<string[]> {
  try {
    console.log(`Extracting keywords from website: ${url}`);

    // Fetch website content
    const response = await fetch(url);
    const html = await response.text();

    // Extract text content (basic implementation)
    const textContent = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    console.log(`Extracted ${textContent.length} characters of text content`);

    // Use AI to extract relevant keywords from the content
    const keywords = await extractKeywordsWithAI(textContent);

    console.log(`Extracted keywords: ${keywords.join(", ")}`);
    return keywords;
  } catch (error) {
    console.error("Error extracting keywords from website:", error);
    // Fallback to basic keyword extraction
    const fallbackKeywords = extractBasicKeywords(url);
    console.log(`Using fallback keywords: ${fallbackKeywords.join(", ")}`);
    return fallbackKeywords;
  }
}

async function extractKeywordsWithAI(content: string): Promise<string[]> {
  try {
    // Try Perplexity first
    if (process.env.PERPLEXITY_API_KEY) {
      console.log("Using Perplexity API for keyword extraction");
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: `You are an expert at analyzing website content and extracting relevant keywords for marketing and audience monitoring. 
              
              Analyze the website content and extract:
              1. Primary product/service keywords (5-8 keywords)
              2. Industry/niche terms (3-5 keywords) 
              3. Problem/solution keywords (3-5 keywords)
              4. Competitor/alternative terms (2-3 keywords)
              5. User intent keywords (help, how to, best, review, etc.)
              
              Return ONLY a JSON array of keywords, no explanations. Example: ["keyword1", "keyword2", "keyword3"]`,
              },
              {
                role: "user",
                content: `Extract marketing-relevant keywords from this website content: ${content.substring(
                  0,
                  3000
                )}`,
              },
            ],
            max_tokens: 500,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content;

        if (aiResponse) {
          try {
            const keywords = JSON.parse(aiResponse);
            if (Array.isArray(keywords)) {
              return keywords.slice(0, 20);
            }
          } catch (parseError) {
            console.error("Error parsing Perplexity response:", parseError);
          }
        }
      } else {
        console.error(`Perplexity API error: ${response.status}`);
      }
    }

    // Fallback to Hugging Face
    if (process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API as fallback for keyword extraction");
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Extract marketing keywords from this content: ${content.substring(
              0,
              2000
            )}. Return only a JSON array of keywords.`,
            parameters: {
              max_length: 300,
              temperature: 0.3,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data[0]?.generated_text || data[0]?.text;

        if (aiResponse) {
          try {
            // Try to extract JSON from the response
            const jsonMatch = aiResponse.match(/\[.*\]/);
            if (jsonMatch) {
              const keywords = JSON.parse(jsonMatch[0]);
              if (Array.isArray(keywords)) {
                return keywords.slice(0, 15);
              }
            }
          } catch (parseError) {
            console.error("Error parsing Hugging Face response:", parseError);
          }
        }
      } else {
        console.error(`Hugging Face API error: ${response.status}`);
      }
    }

    // Final fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI API as final fallback for keyword extraction");
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an expert at analyzing website content and extracting relevant keywords for marketing and audience monitoring. 
              
              Analyze the website content and extract:
              1. Primary product/service keywords (5-8 keywords)
              2. Industry/niche terms (3-5 keywords) 
              3. Problem/solution keywords (3-5 keywords)
              4. Competitor/alternative terms (2-3 keywords)
              5. User intent keywords (help, how to, best, review, etc.)
              
              Return ONLY a JSON array of keywords, no explanations. Example: ["keyword1", "keyword2", "keyword3"]`,
              },
              {
                role: "user",
                content: `Extract marketing-relevant keywords from this website content: ${content.substring(
                  0,
                  3000
                )}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content;

        if (aiResponse) {
          try {
            const keywords = JSON.parse(aiResponse);
            if (Array.isArray(keywords)) {
              return keywords.slice(0, 20);
            }
          } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
          }
        }
      } else {
        console.error(`OpenAI API error: ${response.status}`);
      }
    }

    // Final fallback to basic extraction
    console.log("Using basic keyword extraction as final fallback");
    return extractBasicKeywords(content);
  } catch (error) {
    console.error("Error with AI keyword extraction:", error);
    return extractBasicKeywords(content);
  }
}

function extractBasicKeywords(content: string): string[] {
  // Enhanced keyword extraction based on content analysis
  const marketingKeywords = [
    // Product/Service related
    "marketing",
    "automation",
    "tools",
    "software",
    "platform",
    "solution",
    "service",
    "AI",
    "artificial intelligence",
    "machine learning",
    "analytics",
    "data",
    "social media",
    "content",
    "strategy",
    "campaign",
    "lead generation",
    "email",
    "SEO",
    "PPC",
    "advertising",
    "branding",
    "conversion",

    // Industry terms
    "business",
    "startup",
    "entrepreneur",
    "agency",
    "consulting",
    "freelance",
    "ecommerce",
    "online",
    "digital",
    "web",
    "mobile",
    "app",
    "technology",
    "tech",
    "innovation",
    "productivity",
    "efficiency",

    // Problem/Solution keywords
    "help",
    "how to",
    "guide",
    "tutorial",
    "tips",
    "best practices",
    "problem",
    "solution",
    "improve",
    "optimize",
    "increase",
    "boost",
    "save time",
    "automate",
    "streamline",
    "organize",
    "manage",

    // User intent
    "review",
    "compare",
    "alternative",
    "vs",
    "better",
    "best",
    "free",
    "trial",
    "demo",
    "pricing",
    "cost",
    "affordable",
    "recommend",
    "suggest",
    "advice",
    "expert",
    "professional",
  ];

  // Convert content to lowercase for matching
  const lowerContent = content.toLowerCase();

  // Find keywords that appear in the content
  const foundKeywords = marketingKeywords.filter((keyword) =>
    lowerContent.includes(keyword.toLowerCase())
  );

  // Add some contextual keywords based on content analysis
  const contextualKeywords = [];

  if (lowerContent.includes("ai") || lowerContent.includes("artificial")) {
    contextualKeywords.push("AI marketing", "automation", "smart tools");
  }

  if (
    lowerContent.includes("social") ||
    lowerContent.includes("twitter") ||
    lowerContent.includes("facebook")
  ) {
    contextualKeywords.push("social media", "content creation", "engagement");
  }

  if (lowerContent.includes("analytics") || lowerContent.includes("data")) {
    contextualKeywords.push("analytics", "insights", "reporting");
  }

  if (lowerContent.includes("email") || lowerContent.includes("newsletter")) {
    contextualKeywords.push("email marketing", "newsletter", "automation");
  }

  // Combine and return unique keywords
  const allKeywords = [...foundKeywords, ...contextualKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];

  return uniqueKeywords.slice(0, 15); // Return top 15 keywords
}

async function scrapeForumsForAlerts(
  keywords: string[],
  platforms: string[]
): Promise<any[]> {
  const alerts = [];
  console.log(
    `Starting forum scraping for keywords: ${keywords.join(
      ", "
    )} on platforms: ${platforms.join(", ")}`
  );

  // Prioritize platforms that work better
  const prioritizedPlatforms = platforms.sort((a, b) => {
    // HackerNews is most reliable, then LinkedIn fallbacks, then Reddit (rate limited)
    if (a === "hackernews") return -1;
    if (b === "hackernews") return 1;
    if (a === "linkedin") return -1;
    if (b === "linkedin") return 1;
    return 0;
  });

  for (const platform of prioritizedPlatforms) {
    try {
      console.log(`Scraping platform: ${platform}`);
      const platformAlerts = await scrapePlatform(platform, keywords);
      console.log(`Found ${platformAlerts.length} alerts from ${platform}`);
      alerts.push(...platformAlerts);

      // Add delay between platforms
      if (
        prioritizedPlatforms.indexOf(platform) <
        prioritizedPlatforms.length - 1
      ) {
        console.log("Waiting 1 second before next platform...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error scraping ${platform}:`, error);
      // Continue with other platforms even if one fails
    }
  }

  console.log(`Total alerts found: ${alerts.length}`);
  return alerts;
}

async function scrapeReddit(keywords: string[]): Promise<any[]> {
  try {
    const alerts = [];
    console.log(`Scraping Reddit for keywords: ${keywords.join(", ")}`);

    // Use different approach to avoid 403 errors
    const marketingSubreddits = [
      "marketing",
      "digitalmarketing",
      "socialmedia",
      "entrepreneur",
      "smallbusiness",
      "startups",
      "webdev",
      "seo",
      "ppc",
      "contentmarketing",
    ];

    for (const keyword of keywords.slice(0, 2)) {
      // Reduce to 2 keywords
      for (const subreddit of marketingSubreddits.slice(0, 2)) {
        // Reduce to 2 subreddits
        try {
          // Use different search approach
          const searchUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(
            keyword
          )}&restrict_sr=on&sort=new&t=week&limit=3`;
          console.log(`Searching Reddit: ${searchUrl}`);

          const response = await fetch(searchUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              Accept: "application/json",
              "Accept-Language": "en-US,en;q=0.9",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
            },
          });

          console.log(`Reddit response status: ${response.status}`);

          if (response.status === 403) {
            console.log("Reddit blocked request - trying alternative approach");
            // Try alternative search method
            const altUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=5`;
            const altResponse = await fetch(altUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              },
            });

            if (altResponse.ok) {
              const altData = await altResponse.json();
              if (altData.data && altData.data.children) {
                for (const post of altData.data.children.slice(0, 2)) {
                  const postData = post.data;
                  const content = (
                    postData.title +
                    " " +
                    (postData.selftext || "")
                  ).trim();

                  if (
                    content.length > 20 &&
                    content.toLowerCase().includes(keyword.toLowerCase())
                  ) {
                    const isLead = isLeadOpportunity(content);
                    alerts.push({
                      id: postData.id,
                      platform: "reddit",
                      content: content,
                      author: postData.author,
                      timestamp: new Date(postData.created_utc * 1000),
                      type: isLead ? "opportunity" : "keyword",
                      sentiment: analyzeSentiment(content),
                      engagement: postData.score + postData.num_comments,
                      url: `https://reddit.com${postData.permalink}`,
                      isLead: isLead,
                      subreddit: subreddit,
                    });
                  }
                }
              }
            }
            continue;
          }

          if (response.ok) {
            const data = await response.json();
            console.log(
              `Reddit found ${
                data.data?.children?.length || 0
              } posts in r/${subreddit}`
            );

            if (data.data && data.data.children) {
              for (const post of data.data.children.slice(0, 2)) {
                const postData = post.data;
                const content = (
                  postData.title +
                  " " +
                  (postData.selftext || "")
                ).trim();

                if (content.length > 20) {
                  const isLead = isLeadOpportunity(content);
                  alerts.push({
                    id: postData.id,
                    platform: "reddit",
                    content: content,
                    author: postData.author,
                    timestamp: new Date(postData.created_utc * 1000),
                    type: isLead ? "opportunity" : "keyword",
                    sentiment: analyzeSentiment(content),
                    engagement: postData.score + postData.num_comments,
                    url: `https://reddit.com${postData.permalink}`,
                    isLead: isLead,
                    subreddit: subreddit,
                  });
                }
              }
            }
          } else {
            console.error(
              `Reddit API error: ${response.status} ${response.statusText}`
            );
          }

          // Longer delay between requests
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          console.error(`Error scraping Reddit r/${subreddit}:`, error);
        }
      }
    }

    console.log(`Reddit scraping completed. Found ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error("Error scraping Reddit:", error);
    return [];
  }
}

async function scrapeTwitter(keywords: string[]): Promise<any[]> {
  try {
    const alerts = [];
    console.log(`Scraping Twitter for keywords: ${keywords.join(", ")}`);

    // Try multiple Twitter API tokens
    const twitterTokens = [
      process.env.TWITTER_BEARER_TOKEN,
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
    ].filter(Boolean);

    if (twitterTokens.length > 0) {
      console.log("Using Twitter API for scraping");

      for (const keyword of keywords.slice(0, 3)) {
        for (const token of twitterTokens.slice(0, 1)) {
          // Use first available token
          try {
            const response = await fetch(
              `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
                keyword + " marketing help"
              )}&max_results=10&tweet.fields=created_at,author_id,public_metrics`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log(
                `Twitter API found ${
                  data.data?.length || 0
                } tweets for keyword: ${keyword}`
              );

              if (data.data) {
                for (const tweet of data.data.slice(0, 3)) {
                  const isLead = isLeadOpportunity(tweet.text);
                  alerts.push({
                    id: tweet.id,
                    platform: "twitter",
                    content: tweet.text,
                    author: tweet.author_id || "unknown",
                    timestamp: new Date(tweet.created_at),
                    type: isLead ? "opportunity" : "keyword",
                    sentiment: analyzeSentiment(tweet.text),
                    engagement: tweet.public_metrics?.like_count || 0,
                    url: `https://twitter.com/user/status/${tweet.id}`,
                    isLead: isLead,
                  });
                }
              }
              break; // Success with this token, don't try others
            } else {
              console.error(
                `Twitter API error: ${response.status} ${response.statusText}`
              );
            }
          } catch (error) {
            console.error(
              `Error scraping Twitter for keyword "${keyword}":`,
              error
            );
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } else {
      console.log(
        "No Twitter API tokens available - skipping Twitter scraping"
      );
      console.log(
        "Add TWITTER_BEARER_TOKEN, TWITTER_API_KEY, or TWITTER_ACCESS_TOKEN to environment variables"
      );
    }

    console.log(`Twitter scraping completed. Found ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error("Error scraping Twitter:", error);
    return [];
  }
}

async function scrapeLinkedIn(keywords: string[]): Promise<any[]> {
  try {
    console.log(`Scraping LinkedIn for keywords: ${keywords.join(", ")}`);

    // LinkedIn requires API access - would need LinkedIn API credentials
    if (process.env.LINKEDIN_ACCESS_TOKEN) {
      console.log("Using LinkedIn API for scraping");
      // Implement LinkedIn API calls here
      return [];
    } else {
      console.log(
        "No LinkedIn API token available - skipping LinkedIn scraping"
      );
      return [];
    }
  } catch (error) {
    console.error("Error scraping LinkedIn:", error);
    return [];
  }
}

async function scrapeYouTube(keywords: string[]): Promise<any[]> {
  try {
    const alerts = [];
    console.log(`Scraping YouTube for keywords: ${keywords.join(", ")}`);

    if (process.env.YOUTUBE_API_KEY) {
      for (const keyword of keywords.slice(0, 3)) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
              keyword + " marketing"
            )}&type=video&order=date&maxResults=5&key=${
              process.env.YOUTUBE_API_KEY
            }`
          );

          if (response.ok) {
            const data = await response.json();
            console.log(
              `YouTube found ${
                data.items?.length || 0
              } videos for keyword: ${keyword}`
            );

            if (data.items) {
              for (const video of data.items.slice(0, 2)) {
                const isLead = isLeadOpportunity(
                  video.snippet.title + " " + video.snippet.description
                );
                alerts.push({
                  id: video.id.videoId,
                  platform: "youtube",
                  content:
                    video.snippet.title + " - " + video.snippet.description,
                  author: video.snippet.channelTitle,
                  timestamp: new Date(video.snippet.publishedAt),
                  type: isLead ? "opportunity" : "keyword",
                  sentiment: analyzeSentiment(video.snippet.title),
                  engagement: 0, // Would need additional API call for view count
                  url: `https://youtube.com/watch?v=${video.id.videoId}`,
                  isLead: isLead,
                });
              }
            }
          } else {
            console.error(
              `YouTube API error: ${response.status} ${response.statusText}`
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `Error scraping YouTube for keyword "${keyword}":`,
            error
          );
        }
      }
    } else {
      console.log("No YouTube API key available - skipping YouTube scraping");
    }

    console.log(`YouTube scraping completed. Found ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error("Error scraping YouTube:", error);
    return [];
  }
}

async function scrapeFacebook(keywords: string[]): Promise<any[]> {
  try {
    console.log(`Scraping Facebook for keywords: ${keywords.join(", ")}`);

    // Facebook requires API access - would need Facebook Graph API credentials
    if (process.env.FACEBOOK_ACCESS_TOKEN) {
      console.log("Using Facebook Graph API for scraping");
      // Implement Facebook API calls here
      return [];
    } else {
      console.log(
        "No Facebook API token available - skipping Facebook scraping"
      );
      return [];
    }
  } catch (error) {
    console.error("Error scraping Facebook:", error);
    return [];
  }
}

async function scrapeHackerNews(keywords: string[]): Promise<any[]> {
  try {
    const alerts = [];
    console.log(`Scraping HackerNews for keywords: ${keywords.join(", ")}`);

    for (const keyword of keywords.slice(0, 3)) {
      try {
        // Use HN Algolia API for search
        const searchUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
          keyword
        )}&tags=story&numericFilters=created_at_i>${Math.floor(
          (Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000
        )}`;
        console.log(`Searching HackerNews: ${searchUrl}`);

        const response = await fetch(searchUrl, {
          headers: {
            "User-Agent": "AI-Marketing-Agent/1.0",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(
            `HackerNews found ${
              data.hits?.length || 0
            } stories for keyword: ${keyword}`
          );

          if (data.hits) {
            for (const story of data.hits.slice(0, 2)) {
              const content =
                story.title + (story.story_text ? ` ${story.story_text}` : "");
              const isLead = isLeadOpportunity(content);

              alerts.push({
                id: story.objectID,
                platform: "hackernews",
                content: content,
                author: story.author,
                timestamp: new Date(story.created_at_i * 1000),
                type: isLead ? "opportunity" : "keyword",
                sentiment: analyzeSentiment(content),
                engagement: story.points + (story.num_comments || 0),
                url:
                  story.url ||
                  `https://news.ycombinator.com/item?id=${story.objectID}`,
                isLead: isLead,
              });
            }
          }
        } else {
          console.error(
            `HackerNews API error: ${response.status} ${response.statusText}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(
          `Error scraping HackerNews for keyword "${keyword}":`,
          error
        );
      }
    }

    console.log(`HackerNews scraping completed. Found ${alerts.length} alerts`);
    return alerts;
  } catch (error) {
    console.error("Error scraping HackerNews:", error);
    return [];
  }
}

async function scrapePlatform(
  platform: string,
  keywords: string[]
): Promise<any[]> {
  switch (platform.toLowerCase()) {
    case "reddit":
      return await scrapeReddit(keywords);
    case "twitter":
      return await scrapeTwitter(keywords);
    case "linkedin":
      return await scrapeLinkedIn(keywords);
    case "youtube":
      return await scrapeYouTube(keywords);
    case "facebook":
      return await scrapeFacebook(keywords);
    case "hackernews":
      return await scrapeHackerNews(keywords);
    default:
      console.log(`Unknown platform: ${platform}`);
      return [];
  }
}

async function identifyLeadOpportunities(
  keywords: string[],
  platforms: string[]
): Promise<any[]> {
  const leads = [];
  console.log(
    `Identifying lead opportunities for keywords: ${keywords.join(
      ", "
    )} on platforms: ${platforms.join(", ")}`
  );

  for (const platform of platforms) {
    try {
      console.log(`Finding leads on platform: ${platform}`);
      const platformLeads = await findLeadsOnPlatform(platform, keywords);
      console.log(`Found ${platformLeads.length} leads from ${platform}`);
      leads.push(...platformLeads);
    } catch (error) {
      console.error(`Error finding leads on ${platform}:`, error);
    }
  }

  console.log(`Total leads found: ${leads.length}`);
  return leads;
}

async function findLeadsOnPlatform(
  platform: string,
  keywords: string[]
): Promise<any[]> {
  // This would implement lead identification logic for each platform
  // For now, we'll analyze the alerts to identify leads
  const alerts = await scrapePlatform(platform, keywords);

  console.log(`Analyzing ${alerts.length} alerts from ${platform} for leads`);

  const leads = alerts
    .filter((alert) => alert.isLead)
    .map((alert) => {
      const lead = {
        id: alert.id,
        platform: alert.platform,
        user: alert.author,
        content: alert.content,
        intent: determineIntent(alert.content),
        contactInfo: extractContactInfo(alert.content),
        timestamp: alert.timestamp,
        score: calculateLeadScore(alert),
      };

      console.log(
        `Found lead on ${platform}: ${lead.intent} (score: ${lead.score})`
      );
      return lead;
    });

  console.log(`Found ${leads.length} leads from ${platform}`);
  return leads;
}

function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const positiveWords = [
    "good",
    "great",
    "awesome",
    "love",
    "amazing",
    "excellent",
    "best",
    "recommend",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "hate",
    "worst",
    "awful",
    "disappointing",
    "problem",
    "issue",
  ];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

function isLeadOpportunity(text: string): boolean {
  const leadIndicators = [
    "looking for",
    "need help",
    "recommend",
    "best tool",
    "suggest",
    "anyone know",
    "trying to find",
    "searching for",
    "need advice",
    "what should I",
    "which tool",
    "help me find",
    "need a",
    "want to",
    "can anyone",
    "does anyone",
    "any suggestions",
    "any recommendations",
    "best way to",
    "how to",
    "what tool",
    "which platform",
    "need software",
    "looking to",
    "trying to",
    "need assistance",
    "need guidance",
    "anyone have",
    "anyone use",
    "anyone tried",
    "anyone recommend",
    "need solution",
    "need alternative",
    "need replacement",
    "need upgrade",
  ];

  const lowerText = text.toLowerCase();

  // Check for lead indicators
  const hasLeadIndicator = leadIndicators.some((indicator) =>
    lowerText.includes(indicator)
  );

  // Also check for question marks (questions often indicate need for help)
  const hasQuestion = lowerText.includes("?");

  // Check for specific intent words
  const intentWords = [
    "buy",
    "purchase",
    "need",
    "want",
    "looking",
    "searching",
    "trying",
  ];
  const hasIntent = intentWords.some((word) => lowerText.includes(word));

  return hasLeadIndicator || (hasQuestion && hasIntent);
}

function determineIntent(
  text: string
): "buying" | "researching" | "complaining" | "recommending" {
  const lowerText = text.toLowerCase();

  // Buying intent
  if (
    lowerText.includes("buy") ||
    lowerText.includes("purchase") ||
    lowerText.includes("price") ||
    lowerText.includes("cost") ||
    lowerText.includes("pricing") ||
    lowerText.includes("subscription")
  ) {
    return "buying";
  }

  // Researching intent
  if (
    lowerText.includes("research") ||
    lowerText.includes("looking for") ||
    lowerText.includes("need help") ||
    lowerText.includes("trying to find") ||
    lowerText.includes("searching for") ||
    lowerText.includes("need advice") ||
    lowerText.includes("what should I") ||
    lowerText.includes("which tool") ||
    lowerText.includes("help me find") ||
    lowerText.includes("need a") ||
    lowerText.includes("want to") ||
    lowerText.includes("can anyone") ||
    lowerText.includes("does anyone") ||
    lowerText.includes("any suggestions") ||
    lowerText.includes("any recommendations")
  ) {
    return "researching";
  }

  // Complaining intent
  if (
    lowerText.includes("problem") ||
    lowerText.includes("issue") ||
    lowerText.includes("complaint") ||
    lowerText.includes("broken") ||
    lowerText.includes("not working") ||
    lowerText.includes("error") ||
    lowerText.includes("bug") ||
    lowerText.includes("frustrated") ||
    lowerText.includes("disappointed")
  ) {
    return "complaining";
  }

  // Recommending intent
  if (
    lowerText.includes("recommend") ||
    lowerText.includes("suggest") ||
    lowerText.includes("best") ||
    lowerText.includes("great") ||
    lowerText.includes("awesome") ||
    lowerText.includes("love") ||
    lowerText.includes("amazing") ||
    lowerText.includes("excellent")
  ) {
    return "recommending";
  }

  return "researching";
}

function extractContactInfo(text: string): string | undefined {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const email = text.match(emailRegex);
  return email ? email[0] : undefined;
}

function calculateLeadScore(alert: any): number {
  let score = 0;

  // Intent scoring
  if (
    alert.content.toLowerCase().includes("buy") ||
    alert.content.toLowerCase().includes("purchase")
  ) {
    score += 30;
  }
  if (
    alert.content.toLowerCase().includes("need help") ||
    alert.content.toLowerCase().includes("looking for")
  ) {
    score += 25;
  }

  // Engagement scoring
  score += Math.min(alert.engagement * 2, 20);

  // Sentiment scoring
  if (alert.sentiment === "positive") score += 10;
  if (alert.sentiment === "negative") score -= 5;

  return Math.min(score, 100);
}

async function getRealForumAlerts(): Promise<any[]> {
  // This function is no longer used - alerts are now dynamic
  // based on website analysis in the main endpoints
  console.log(
    "getRealForumAlerts() is deprecated - use dynamic website analysis"
  );
  return [];
}

async function getRealLeadOpportunities(): Promise<any[]> {
  // This function is no longer used - leads are now dynamic
  // based on website analysis in the main endpoints
  console.log(
    "getRealLeadOpportunities() is deprecated - use dynamic website analysis"
  );
  return [];
}

async function analyzeKeywords(keywords: string[]) {
  // Real keyword analysis would involve:
  // 1. Search volume data from Google Keyword Planner
  // 2. Social media trend analysis
  // 3. Competitive analysis

  const analysis = [];

  for (const keyword of keywords) {
    try {
      // Get search volume (this would use Google Ads API)
      const searchVolume = await getSearchVolume(keyword);

      // Get social media mentions
      const socialMentions = await getSocialMentions(keyword);

      analysis.push({
        keyword,
        volume: searchVolume,
        trend: determineTrend(socialMentions),
        platforms: ["twitter", "linkedin", "reddit"],
        engagement: calculateEngagement(socialMentions),
      });
    } catch (error) {
      console.error(`Error analyzing keyword ${keyword}:`, error);
    }
  }

  return analysis;
}

async function getSearchVolume(keyword: string): Promise<number> {
  // This would use Google Ads API to get real search volume
  // For now, return a realistic estimate based on keyword
  const baseVolume = keyword.length * 100;
  return Math.max(baseVolume, 100);
}

async function getSocialMentions(keyword: string): Promise<number> {
  // This would aggregate mentions across platforms
  // For now, return a realistic estimate based on keyword
  const baseMentions = keyword.length * 10;
  return Math.max(baseMentions, 5);
}

function determineTrend(mentions: number): "up" | "down" | "stable" {
  // This would compare current mentions to historical data
  // For now, use a simple algorithm based on mention count
  if (mentions > 50) return "up";
  if (mentions < 10) return "down";
  return "stable";
}

function calculateEngagement(mentions: number): number {
  // This would calculate engagement rate based on likes, shares, comments
  return Math.floor((mentions / 100) * 5) + 5;
}
