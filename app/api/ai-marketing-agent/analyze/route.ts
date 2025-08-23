import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { OpenAI } from "openai";

// Initialize OpenAI client for fallback
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Perplexity API configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";
const PERPLEXITY_MODEL = "sonar-pro";

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional for testing)
    const session = await getServerSession();
    const userId = session?.user?.email || "demo-user@example.com";

    const { websiteUrl } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(websiteUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Step 1: Scrape website content
    const websiteContent = await scrapeWebsite(websiteUrl);

    // Step 2: Analyze content with AI (Perplexity first, OpenAI fallback)
    const aiAnalysis = await analyzeWithAI(websiteContent, websiteUrl);

    // Step 3: Generate intelligent recommendations
    const recommendations = await generateRecommendations(aiAnalysis);

    // Connect to database
    await connectDB();

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis,
      recommendations,
      message: "Website analysis completed successfully",
    });
  } catch (error) {
    console.error("Error analyzing website:", error);
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}

async function scrapeWebsite(url: string) {
  try {
    // In production, use a proper web scraping service like ScrapingBee, Puppeteer, or Cheerio
    // For now, we'll simulate the scraping process

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Marketing-Agent/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();

    // Extract basic metadata (in production, use a proper HTML parser)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const keywordsMatch = html.match(
      /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i
    );

    // Extract main content (simplified)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const mainContent = bodyMatch
      ? bodyMatch[1]
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";

    return {
      url,
      title: titleMatch ? titleMatch[1] : "Unknown Title",
      description: descriptionMatch ? descriptionMatch[1] : "",
      keywords: keywordsMatch
        ? keywordsMatch[1].split(",").map((k) => k.trim())
        : [],
      content: mainContent.substring(0, 2000), // Limit content for AI analysis
      html,
    };
  } catch (error) {
    console.error("Error scraping website:", error);
    // Return fallback data
    return {
      url,
      title: "Website Analysis",
      description: "Content analysis for marketing purposes",
      keywords: ["marketing", "content", "analysis"],
      content: "Website content for AI analysis",
      html: "",
    };
  }
}

async function analyzeWithAI(websiteContent: any, url: string) {
  try {
    // Try Perplexity API first
    if (PERPLEXITY_API_KEY) {
      try {
        return await analyzeWithPerplexity(websiteContent, url);
      } catch (perplexityError) {
        console.error("Perplexity API error:", perplexityError);
        console.log("Falling back to OpenAI...");
      }
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        return await analyzeWithOpenAI(websiteContent, url);
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
      }
    }

    // Final fallback
    return getFallbackAnalysis(websiteContent, url);
  } catch (error) {
    console.error("Error with AI analysis:", error);
    return getFallbackAnalysis(websiteContent, url);
  }
}

async function analyzeWithPerplexity(websiteContent: any, url: string) {
  const prompt = `
    Analyze this website for marketing purposes:

    URL: ${url}
    Title: ${websiteContent.title || "N/A"}
    Description: ${websiteContent.description || "N/A"}
    Keywords: ${websiteContent.keywords?.join(", ") || "N/A"}
    Content: ${websiteContent.content?.substring(0, 500) || "N/A"}

    Return a JSON object with this structure:
    {
      "title": "Website title",
      "description": "Brief description",
      "keywords": ["keyword1", "keyword2"],
      "category": "Business category",
      "targetAudience": ["audience1", "audience2"],
      "contentType": "product|service|blog|news|tool",
      "sentiment": "positive|neutral|negative",
      "trendingTopics": ["topic1", "topic2"],
      "contentAnalysis": {
        "keyThemes": ["theme1", "theme2"],
        "industryTrends": ["trend1", "trend2"]
      }
    }

    Respond with valid JSON only.
  `;

  try {
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a marketing analyst. Respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error ${response.status}:`, errorText);
      throw new Error(
        `Perplexity API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (aiResponse) {
      try {
        // Clean the response to extract JSON
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error parsing Perplexity response:", parseError);
        console.error("Raw response:", aiResponse);
        throw new Error("Invalid JSON response from Perplexity");
      }
    }

    throw new Error("No response from Perplexity API");
  } catch (error) {
    console.error("Perplexity API request failed:", error);
    throw error;
  }
}

async function analyzeWithOpenAI(websiteContent: any, url: string) {
  const prompt = `
    Analyze this website content for marketing purposes and provide detailed insights.

    URL: ${url}
    Title: ${websiteContent.title}
    Description: ${websiteContent.description}
    Keywords: ${websiteContent.keywords.join(", ")}
    Content: ${websiteContent.content.substring(0, 1000)}

    Please provide a JSON response with the following structure:
    {
      "title": "Extracted or inferred title",
      "description": "Brief description of the website",
      "keywords": ["relevant", "keywords", "extracted"],
      "category": "Business category (e.g., SaaS, E-commerce, Blog, News, Tool)",
      "targetAudience": ["primary", "audience", "segments"],
      "contentType": "product|service|blog|news|tool",
      "sentiment": "positive|neutral|negative",
      "trendingTopics": ["relevant", "trending", "topics"],
      "contentAnalysis": {
        "wordCount": 0,
        "readabilityScore": "Easy|Medium|Hard",
        "keyThemes": ["theme1", "theme2"],
        "competitorMentions": [],
        "industryTrends": ["trend1", "trend2"]
      }
    }

    Focus on identifying the business type, target audience, and content characteristics that would be relevant for social media marketing.
    
    IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text, explanations, or markdown formatting.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert marketing analyst specializing in social media strategy and content optimization. Provide accurate, actionable insights for marketing purposes. Always respond with valid JSON only - no additional text or formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (aiResponse) {
      try {
        // Clean the response to extract JSON
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        console.error("Raw response:", aiResponse);
        throw new Error("Invalid JSON response from OpenAI");
      }
    }

    throw new Error("No response from OpenAI API");
  } catch (error) {
    console.error("OpenAI API request failed:", error);
    throw error;
  }
}

function getFallbackAnalysis(websiteContent: any, url: string) {
  throw new Error("AI analysis failed. Please try again.");
}

async function generateRecommendations(analysis: any) {
  try {
    // Try Perplexity API first
    if (PERPLEXITY_API_KEY) {
      try {
        return await generateRecommendationsWithPerplexity(analysis);
      } catch (perplexityError) {
        console.error(
          "Perplexity API error for recommendations:",
          perplexityError
        );
        console.log("Falling back to OpenAI for recommendations...");
      }
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        return await generateRecommendationsWithOpenAI(analysis);
      } catch (openaiError) {
        console.error("OpenAI API error for recommendations:", openaiError);
      }
    }

    // Final fallback
    return getFallbackRecommendations(analysis);
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return getFallbackRecommendations(analysis);
  }
}

async function generateRecommendationsWithPerplexity(analysis: any) {
  const prompt = `
    Based on this website analysis, provide intelligent marketing recommendations.

    ${JSON.stringify(analysis, null, 2)}

    Please provide a JSON response with the following structure:
    {
      "suggestedPlatforms": ["twitter", "linkedin", "telegram"],
      "bestTimeToPost": "9:00 AM - 11:00 AM (Weekdays)",
      "targetAudience": ["audience1", "audience2"],
      "hashtags": ["#hashtag1", "#hashtag2"],
      "tone": "professional|casual|friendly|enthusiastic",
      "contentStrategy": "Brief content strategy description",
      "telegramGroups": ["group1", "group2"],
      "optimalPostingSchedule": {
        "twitter": ["9:00 AM", "2:00 PM", "7:00 PM"],
        "linkedin": ["8:00 AM", "12:00 PM", "5:00 PM"],
        "telegram": ["10:00 AM", "3:00 PM", "8:00 PM"]
      },
      "contentVariations": {
        "twitter": "Twitter-optimized content",
        "linkedin": "LinkedIn-optimized content",
        "telegram": "Telegram-optimized content"
      }
    }

    Consider the content type, target audience, and industry when making recommendations.
    
    IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text, explanations, or markdown formatting.
  `;

  try {
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert social media strategist. Provide actionable recommendations for platform selection, timing, and content optimization. Always respond with valid JSON only - no additional text or formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error ${response.status}:`, errorText);
      throw new Error(
        `Perplexity API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (aiResponse) {
      try {
        // Clean the response to extract JSON
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error parsing Perplexity recommendations:", parseError);
        console.error("Raw response:", aiResponse);
        throw new Error("Invalid JSON response from Perplexity");
      }
    }

    throw new Error("No response from Perplexity API");
  } catch (error) {
    console.error("Perplexity API request failed:", error);
    throw error;
  }
}

async function generateRecommendationsWithOpenAI(analysis: any) {
  const prompt = `
    Based on this website analysis, provide intelligent marketing recommendations.

    ${JSON.stringify(analysis, null, 2)}

    Please provide a JSON response with the following structure:
    {
      "suggestedPlatforms": ["twitter", "linkedin", "telegram"],
      "bestTimeToPost": "9:00 AM - 11:00 AM (Weekdays)",
      "targetAudience": ["audience1", "audience2"],
      "hashtags": ["#hashtag1", "#hashtag2"],
      "tone": "professional|casual|friendly|enthusiastic",
      "contentStrategy": "Brief content strategy description",
      "telegramGroups": ["group1", "group2"],
      "optimalPostingSchedule": {
        "twitter": ["9:00 AM", "2:00 PM", "7:00 PM"],
        "linkedin": ["8:00 AM", "12:00 PM", "5:00 PM"],
        "telegram": ["10:00 AM", "3:00 PM", "8:00 PM"]
      },
      "contentVariations": {
        "twitter": "Twitter-optimized content",
        "linkedin": "LinkedIn-optimized content",
        "telegram": "Telegram-optimized content"
      }
    }

    Consider the content type, target audience, and industry when making recommendations.
    
    IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text, explanations, or markdown formatting.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert social media strategist. Provide actionable recommendations for platform selection, timing, and content optimization. Always respond with valid JSON only - no additional text or formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (aiResponse) {
      try {
        // Clean the response to extract JSON
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error parsing OpenAI recommendations:", parseError);
        console.error("Raw response:", aiResponse);
        throw new Error("Invalid JSON response from OpenAI");
      }
    }

    throw new Error("No response from OpenAI API");
  } catch (error) {
    console.error("OpenAI API request failed:", error);
    throw error;
  }
}

function getFallbackRecommendations(analysis: any) {
  throw new Error("AI recommendations failed. Please try again.");
}
