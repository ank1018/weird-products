"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Twitter,
  Linkedin,
  Send,
  Sparkles,
  FileText,
  Settings,
  Calendar,
  Clock,
  History,
  ExternalLink,
  Zap,
  TrendingUp,
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  BarChart3,
  Target,
  Brain,
  Share2,
  MessageCircle,
  Hash,
  Users2,
  Lock,
  Shield,
  Key,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import "./ai-marketing-agent.css";
import "./audience-monitor.css";
import SocialConnect from "./components/social-connect";
import AudienceMonitor from "./components/audience-monitor";

interface MarketingPost {
  id: string;
  content: string;
  platforms: string[];
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduledFor?: Date;
  postedAt?: Date;
  createdAt: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
  aiRecommendations?: {
    suggestedPlatforms: string[];
    bestTimeToPost: string;
    targetAudience: string[];
    hashtags: string[];
    tone: string;
  };
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  color: string;
  followers?: number;
  type: "social" | "messaging" | "professional";
  audience: string[];
  bestFor: string[];
}

interface WebsiteAnalysis {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  targetAudience: string[];
  contentType: "product" | "service" | "blog" | "news" | "tool";
  sentiment: "positive" | "neutral" | "negative";
  trendingTopics: string[];
}

export default function AIMarketingAgentPage() {
  const { data: session, status } = useSession();

  // All hooks must be called before any conditional returns
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contentType, setContentType] = useState("social-post");
  const [tone, setTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [websiteAnalysis, setWebsiteAnalysis] =
    useState<WebsiteAnalysis | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<{
    [url: string]: {
      analysis: WebsiteAnalysis;
      recommendations: any;
      timestamp: Date;
    };
  }>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      connected: false,
      color: "from-blue-400 to-blue-600",
      type: "social",
      audience: ["tech enthusiasts", "professionals", "news followers"],
      bestFor: [
        "news",
        "tech updates",
        "quick announcements",
        "trending topics",
      ],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      connected: false,
      color: "from-blue-600 to-blue-800",
      type: "professional",
      audience: ["professionals", "business owners", "industry experts"],
      bestFor: [
        "business insights",
        "professional achievements",
        "industry news",
        "thought leadership",
      ],
    },
    {
      id: "telegram",
      name: "Telegram Groups",
      icon: <Send className="w-5 h-5" />,
      connected: false,
      color: "from-blue-300 to-blue-500",
      type: "messaging",
      audience: [
        "tech communities",
        "crypto enthusiasts",
        "developers",
        "startup founders",
      ],
      bestFor: [
        "community engagement",
        "product launches",
        "exclusive content",
        "direct communication",
      ],
    },
    {
      id: "reddit",
      name: "Reddit",
      icon: <MessageCircle className="w-5 h-5" />,
      connected: false,
      color: "from-orange-400 to-orange-600",
      type: "social",
      audience: ["tech communities", "hobbyists", "enthusiasts", "developers"],
      bestFor: [
        "community discussions",
        "product feedback",
        "niche audiences",
        "authentic engagement",
      ],
    },
    {
      id: "hackernews",
      name: "Hacker News",
      icon: <Hash className="w-5 h-5" />,
      connected: false,
      color: "from-orange-500 to-orange-700",
      type: "social",
      audience: ["developers", "tech professionals", "startup founders"],
      bestFor: [
        "tech products",
        "developer tools",
        "startup launches",
        "technical content",
      ],
    },
  ]);

  // Load connected accounts from localStorage
  useEffect(() => {
    const loadConnectedAccounts = () => {
      try {
        const saved = localStorage.getItem("socialAccounts");
        if (saved) {
          const accounts = JSON.parse(saved);
          setPlatforms((prevPlatforms) =>
            prevPlatforms.map((platform) => {
              const account = accounts.find(
                (acc: any) => acc.platform === platform.id
              );
              return {
                ...platform,
                connected: account?.connected || false,
              };
            })
          );
        }
      } catch (error) {
        console.error("Error loading connected accounts:", error);
      }
    };

    loadConnectedAccounts();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadConnectedAccounts();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also refresh every 5 seconds to keep status in sync
    const interval = setInterval(loadConnectedAccounts, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Load analysis history from localStorage and MongoDB
  useEffect(() => {
    const loadAnalysisHistory = async () => {
      try {
        // First, load from localStorage (fast access)
        const saved = localStorage.getItem("analysisHistory");
        let localHistory = {};

        if (saved) {
          const history = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          localHistory = Object.keys(history).reduce((acc, url) => {
            acc[url] = {
              ...history[url],
              timestamp: new Date(history[url].timestamp),
            };
            return acc;
          }, {} as any);
        }

        // Then, try to load from MongoDB (cross-device access)
        try {
          const response = await fetch(
            "/api/ai-marketing-agent/analysis-history"
          );

          if (response.ok) {
            const data = await response.json();
            const cloudHistory = data.analyses.reduce(
              (acc: any, analysis: any) => {
                acc[analysis.websiteUrl] = {
                  analysis: analysis.analysis,
                  recommendations: analysis.recommendations,
                  timestamp: new Date(analysis.timestamp),
                };
                return acc;
              },
              {}
            );

            // Merge local and cloud history, preferring local for conflicts
            const mergedHistory = { ...cloudHistory, ...localHistory };
            setAnalysisHistory(mergedHistory);

            // Update localStorage with merged data
            localStorage.setItem(
              "analysisHistory",
              JSON.stringify(mergedHistory)
            );

            console.log(
              `Loaded ${Object.keys(mergedHistory).length} analyses (${
                Object.keys(localHistory).length
              } local, ${Object.keys(cloudHistory).length} cloud)`
            );
          } else {
            // If cloud fetch fails, use local history only
            setAnalysisHistory(localHistory);
            console.log("Using local history only (cloud unavailable)");
          }
        } catch (cloudError) {
          // If cloud fetch fails, use local history only
          setAnalysisHistory(localHistory);
          console.log(
            "Using local history only (cloud unavailable):",
            cloudError
          );
        }
      } catch (error) {
        console.error("Error loading analysis history:", error);
      }
    };

    loadAnalysisHistory();
  }, []);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="ai-marketing-agent">
        <div className="main-container">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Require authentication for all features
  if (!session) {
    return (
      <div className="ai-marketing-agent">
        <div className="main-container">
          <div className="auth-required-container">
            <div className="auth-content">
              <div className="auth-icon">
                <Lock className="w-12 h-12" />
              </div>

              <div className="auth-text">
                <h2 className="text-2xl font-bold mb-2">
                  Authentication Required
                </h2>
                <p className="text-gray-300 mb-6">
                  Please sign in to access the AI Marketing Agent and all its
                  features.
                </p>
              </div>

              <div className="auth-features">
                <div className="feature-item">
                  <Shield className="w-4 h-4" />
                  <span>Secure AI content generation</span>
                </div>
                <div className="feature-item">
                  <Users className="w-4 h-4" />
                  <span>Personal social media accounts</span>
                </div>
                <div className="feature-item">
                  <Key className="w-4 h-4" />
                  <span>OAuth 2.0 security</span>
                </div>
                <div className="feature-item">
                  <Brain className="w-4 h-4" />
                  <span>AI-powered recommendations</span>
                </div>
              </div>

              <button
                onClick={() => signIn("google")}
                className="btn btn-primary btn-full"
              >
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analyzeWebsite = async (url: string, forceRefresh: boolean = false) => {
    setIsAnalyzing(true);

    try {
      // Check if we have cached analysis and user doesn't want to force refresh
      if (!forceRefresh && isAnalysisCached(url)) {
        const cached = getAnalysisFromHistory(url);
        setWebsiteAnalysis(cached.analysis);
        setAiRecommendations(cached.recommendations);
        showToast(
          `Using cached analysis from ${cached.timestamp.toLocaleString()}. Click "Re-analyze" for fresh data.`,
          "success"
        );
        setIsAnalyzing(false);
        return;
      }

      const response = await fetch("/api/ai-marketing-agent/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl: url }),
      });

      if (response.ok) {
        const data = await response.json();
        setWebsiteAnalysis(data.analysis);
        setAiRecommendations(data.recommendations);

        // Save to history (both localStorage and MongoDB)
        await saveAnalysisHistory(url, data.analysis, data.recommendations);

        showToast(
          forceRefresh
            ? "Website re-analyzed successfully! Fresh AI recommendations generated."
            : "Website analysis completed! AI recommendations generated.",
          "success"
        );
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to analyze website", "error");
      }
    } catch (error) {
      console.error("Error analyzing website:", error);
      showToast("Error analyzing website", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateContent = async () => {
    if (!websiteUrl.trim()) {
      showToast("Please enter a website URL", "error");
      return;
    }

    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(websiteUrl)) {
      showToast(
        "Please enter a valid URL (e.g., https://example.com)",
        "error"
      );
      return;
    }

    setIsGenerating(true);

    try {
      // First analyze the website if not already done
      if (!websiteAnalysis) {
        await analyzeWebsite(websiteUrl, false); // Use cached data if available
      }

      // Use the analysis results to generate content via API
      const analysis = websiteAnalysis;

      if (!analysis) {
        showToast("Please analyze the website first", "error");
        return;
      }

      const response = await fetch("/api/ai-marketing-agent/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteUrl,
          contentType,
          tone,
          analysis, // Pass the analysis data to the API
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedContent(data.content);

      // Auto-select recommended platforms if available
      if (aiRecommendations?.suggestedPlatforms.length > 0) {
        setSelectedPlatforms(aiRecommendations.suggestedPlatforms);
      }

      showToast("Content generated successfully with AI analysis!", "success");
    } catch (error) {
      console.error("Error generating content:", error);
      showToast("Failed to generate content. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const postToSocialMedia = async () => {
    if (!generatedContent.trim()) {
      showToast("Please generate content first", "error");
      return;
    }

    if (selectedPlatforms.length === 0) {
      showToast("Please select at least one platform", "error");
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch(
        "/api/ai-marketing-agent/social-integration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: generatedContent,
            platforms: selectedPlatforms.map((p) => p.toLowerCase()),
            aiRecommendations: aiRecommendations,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Create new post record
        const newPost: MarketingPost = {
          id: Date.now().toString(),
          content: generatedContent,
          platforms: selectedPlatforms,
          status: "posted",
          postedAt: new Date(),
          createdAt: new Date(),
          engagement: {
            likes: Math.floor(Math.random() * 50) + 20,
            shares: Math.floor(Math.random() * 10) + 5,
            comments: Math.floor(Math.random() * 5) + 2,
          },
          aiRecommendations: aiRecommendations,
        };

        setPosts((prev) => [newPost, ...prev]);
        setGeneratedContent("");
        setSelectedPlatforms([]);

        // Show success message with platform details
        const platformNames = selectedPlatforms
          .map((p) => platforms.find((platform) => platform.id === p)?.name)
          .join(", ");

        showToast(
          `Content posted successfully to ${platformNames}!`,
          "success"
        );

        // Show detailed results
        if (data.results.success.length > 0) {
          showToast(
            `Successfully posted to: ${data.results.success.join(", ")}`,
            "success"
          );
        }

        if (data.results.failed.length > 0) {
          const failedPlatforms = data.results.failed.join(", ");
          showToast(
            `Failed to post to: ${failedPlatforms}. Please connect your accounts in the Social Media Connection section.`,
            "error"
          );
        }

        // If Telegram is selected, show group suggestions
        if (
          selectedPlatforms.includes("telegram") &&
          aiRecommendations?.telegramGroups?.length > 0
        ) {
          showToast(
            `Consider sharing in these Telegram groups: ${aiRecommendations.telegramGroups.join(
              ", "
            )}`,
            "info"
          );
        }
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to post content", "error");
      }
    } catch (error) {
      console.error("Error posting to social media:", error);
      showToast("Error posting to social media", "error");
    } finally {
      setIsPosting(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);

    if (!platform?.connected) {
      toast.error(
        `${
          platform?.name || "Platform"
        } is not connected. Please connect it first.`
      );
      return;
    }

    setSelectedPlatforms((prev) => {
      const newSelection = prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId];

      // Show feedback
      if (newSelection.includes(platformId)) {
        toast.success(`${platform.name} added to selection`);
      } else {
        toast.success(`${platform.name} removed from selection`);
      }

      return newSelection;
    });
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTotalEngagement = () => {
    return posts.reduce((total, post) => {
      if (post.engagement) {
        return (
          total +
          post.engagement.likes +
          post.engagement.shares +
          post.engagement.comments
        );
      }
      return total;
    }, 0);
  };

  // Function to refresh platform connection status
  const refreshPlatformStatus = () => {
    try {
      const saved = localStorage.getItem("socialAccounts");
      if (saved) {
        const accounts = JSON.parse(saved);
        setPlatforms((prevPlatforms) =>
          prevPlatforms.map((platform) => {
            const account = accounts.find(
              (acc: any) => acc.platform === platform.id
            );
            return {
              ...platform,
              connected: account?.connected || false,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error refreshing platform status:", error);
    }
  };

  const saveAnalysisHistory = async (
    url: string,
    analysis: WebsiteAnalysis,
    recommendations: any
  ) => {
    try {
      // Save to localStorage first (fast access)
      const newHistory = {
        ...analysisHistory,
        [url]: {
          analysis,
          recommendations,
          timestamp: new Date(),
        },
      };
      setAnalysisHistory(newHistory);
      localStorage.setItem("analysisHistory", JSON.stringify(newHistory));

      // Also save to MongoDB for cross-device access
      try {
        const response = await fetch(
          "/api/ai-marketing-agent/analysis-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              websiteUrl: url,
              analysis,
              recommendations,
            }),
          }
        );

        if (response.ok) {
          console.log("Analysis saved to cloud storage");
        } else {
          console.warn(
            "Failed to save to cloud storage, but local cache is available"
          );
        }
      } catch (cloudError) {
        console.warn(
          "Cloud storage unavailable, using local cache only:",
          cloudError
        );
      }
    } catch (error) {
      console.error("Error saving analysis history:", error);
    }
  };

  const getAnalysisFromHistory = (url: string) => {
    return analysisHistory[url];
  };

  const isAnalysisCached = (url: string) => {
    const cached = analysisHistory[url];
    if (!cached) return false;

    // Check if analysis is less than 24 hours old
    const hoursSinceAnalysis =
      (Date.now() - cached.timestamp.getTime()) / (1000 * 60 * 60);
    return hoursSinceAnalysis < 24;
  };

  const clearAnalysisHistory = async () => {
    try {
      // Clear localStorage
      setAnalysisHistory({});
      localStorage.removeItem("analysisHistory");

      // Also clear from MongoDB
      try {
        const response = await fetch(
          "/api/ai-marketing-agent/analysis-history",
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Analysis history cleared from all devices");
        } else {
          toast.success("Analysis history cleared locally");
        }
      } catch (cloudError) {
        console.warn("Failed to clear cloud history:", cloudError);
        toast.success("Analysis history cleared locally");
      }
    } catch (error) {
      console.error("Error clearing analysis history:", error);
      toast.error("Failed to clear analysis history");
    }
  };

  const syncHistoryFromCloud = async () => {
    try {
      const response = await fetch("/api/ai-marketing-agent/analysis-history");

      if (response.ok) {
        const data = await response.json();
        const cloudHistory = data.analyses.reduce((acc: any, analysis: any) => {
          acc[analysis.websiteUrl] = {
            analysis: analysis.analysis,
            recommendations: analysis.recommendations,
            timestamp: new Date(analysis.timestamp),
          };
          return acc;
        }, {});

        setAnalysisHistory(cloudHistory);
        localStorage.setItem("analysisHistory", JSON.stringify(cloudHistory));
        toast.success(
          `Synced ${Object.keys(cloudHistory).length} analyses from cloud`
        );
      } else {
        toast.error("Failed to sync from cloud");
      }
    } catch (error) {
      console.error("Error syncing from cloud:", error);
      toast.error("Failed to sync from cloud");
    }
  };

  return (
    <div className="ai-marketing-agent">
      {/* Header */}
      <header>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Brain className="w-5 h-5" />
            </div>
            <span className="logo-text">AI Marketing Agent</span>
          </div>
          <div className="header-actions">
            <span className="text-gray-300">
              Welcome, {session?.user?.name || "User"}
            </span>
            <button onClick={() => signOut()} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">AI-Powered Marketing Intelligence</h1>
          <p className="hero-subtitle">
            Our AI analyzes your website content and intelligently decides the
            best platforms, timing, and messaging for maximum engagement.
          </p>
        </div>

        {/* Social Media Connection */}
        <SocialConnect />

        {/* Platform Status Refresh */}
        <div className="text-center mb-6">
          <button
            onClick={refreshPlatformStatus}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Connection Status
          </button>
        </div>

        {/* AI Audience Monitoring */}
        <AudienceMonitor
          websiteUrl={websiteUrl}
          keywords={
            websiteAnalysis?.keywords ||
            aiRecommendations?.suggestedPlatforms ||
            []
          }
        />

        {/* Content Grid */}
        <div className="content-grid">
          {/* Content Generation Panel */}
          <div className="content-panel">
            <div className="panel-header">
              <div className="panel-icon">
                <Brain className="w-5 h-5" />
              </div>
              <h2 className="panel-title">AI Content Analysis & Generation</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Website URL</label>
              <div className="url-input-group">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  className="form-input"
                />
                {websiteUrl && isAnalysisCached(websiteUrl) && (
                  <div className="cached-analysis-info">
                    <History className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      Cached analysis available
                    </span>
                  </div>
                )}
              </div>

              {/* Analysis History Controls */}
              {websiteUrl && (
                <div className="analysis-controls">
                  <div className="control-buttons">
                    <button
                      onClick={() => analyzeWebsite(websiteUrl, false)}
                      disabled={isAnalyzing}
                      className="btn btn-primary btn-sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="loading-spinner"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          {isAnalysisCached(websiteUrl)
                            ? "Use Cached"
                            : "Analyze"}
                        </>
                      )}
                    </button>

                    {isAnalysisCached(websiteUrl) && (
                      <button
                        onClick={() => analyzeWebsite(websiteUrl, true)}
                        disabled={isAnalyzing}
                        className="btn btn-secondary btn-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Re-analyze
                      </button>
                    )}
                  </div>

                  <div className="history-info">
                    <span className="text-xs text-gray-400">
                      {Object.keys(analysisHistory).length} cached analyses
                    </span>
                    <div className="history-actions">
                      <button
                        onClick={syncHistoryFromCloud}
                        className="btn btn-outline btn-xs"
                        title="Sync from cloud storage"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Sync
                      </button>
                      {Object.keys(analysisHistory).length > 0 && (
                        <>
                          <button
                            onClick={() => {
                              const historyList = Object.entries(
                                analysisHistory
                              )
                                .map(
                                  ([url, data]) =>
                                    `${url} (${data.timestamp.toLocaleString()})`
                                )
                                .join("\n");
                              alert(`Analysis History:\n\n${historyList}`);
                            }}
                            className="btn btn-outline btn-xs"
                          >
                            View History
                          </button>
                          <button
                            onClick={clearAnalysisHistory}
                            className="btn btn-outline btn-xs"
                          >
                            Clear History
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Results */}
            {websiteAnalysis && (
              <div className="generated-content">
                <div className="panel-header">
                  <div className="panel-icon">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="panel-title">AI Analysis Results</h3>
                </div>
                <div className="content-text">
                  <strong>Category:</strong> {websiteAnalysis.category}
                  <br />
                  <strong>Target Audience:</strong>{" "}
                  {websiteAnalysis.targetAudience.join(", ")}
                  <br />
                  <strong>Content Type:</strong> {websiteAnalysis.contentType}
                  <br />
                  <strong>Trending Topics:</strong>{" "}
                  {websiteAnalysis.trendingTopics.join(", ")}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {aiRecommendations && (
              <div className="generated-content">
                <div className="panel-header">
                  <div className="panel-icon">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="panel-title">AI Recommendations</h3>
                </div>
                <div className="content-text">
                  <strong>Suggested Platforms:</strong>{" "}
                  {aiRecommendations.suggestedPlatforms
                    .map(
                      (p: string) =>
                        platforms.find((platform) => platform.id === p)?.name
                    )
                    .join(", ")}
                  <br />
                  <strong>Best Time to Post:</strong>{" "}
                  {aiRecommendations.bestTimeToPost}
                  <br />
                  <strong>Recommended Hashtags:</strong>{" "}
                  {aiRecommendations.hashtags.join(" ")}
                  <br />
                  {aiRecommendations.telegramGroups &&
                    aiRecommendations.telegramGroups.length > 0 && (
                      <>
                        <strong>Telegram Groups:</strong>{" "}
                        {aiRecommendations.telegramGroups.join(", ")}
                        <br />
                      </>
                    )}
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="form-select"
                  >
                    <option value="social-post">Social Media Post</option>
                    <option value="blog-post">Blog Post</option>
                    <option value="product-description">
                      Product Description
                    </option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="form-select"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={generateContent}
              disabled={isGenerating || isAnalyzing}
              className="btn btn-primary btn-full"
            >
              {isGenerating || isAnalyzing ? (
                <>
                  <div className="loading-spinner"></div>
                  {isAnalyzing
                    ? "Analyzing Website..."
                    : "Generating Content..."}
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze & Generate Content
                </>
              )}
            </button>

            {/* Generated Content */}
            {generatedContent && (
              <>
                {/* Auto-select AI recommended platforms */}
                {aiRecommendations?.suggestedPlatforms && (
                  <div className="ai-recommendations">
                    <div className="recommendations-header">
                      <Brain className="w-4 h-4" />
                      <span>AI Recommendations</span>
                    </div>
                    <div className="recommendations-content">
                      <p className="text-sm text-gray-300 mb-2">
                        AI suggests posting to:{" "}
                        {aiRecommendations.suggestedPlatforms.join(", ")}
                      </p>
                      <button
                        onClick={() => {
                          const connectedRecommended =
                            aiRecommendations.suggestedPlatforms.filter(
                              (platformId: string) =>
                                platforms.find((p) => p.id === platformId)
                                  ?.connected
                            );
                          setSelectedPlatforms(connectedRecommended);
                          toast.success(
                            `Auto-selected ${connectedRecommended.length} AI recommended platform(s)`
                          );
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Auto-Select AI Recommended
                      </button>
                    </div>
                  </div>
                )}

                <div className="generated-content">
                  <div className="panel-header">
                    <div className="panel-icon">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="panel-title">Generated Content</h3>
                  </div>
                  <div className="content-text">{generatedContent}</div>
                </div>

                {/* Platform Selection */}
                <div className="platforms-section">
                  <label className="form-label">
                    Select Platforms (Manual Selection)
                  </label>
                  <div className="platforms-grid">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        disabled={!platform.connected}
                        className={`platform-button ${
                          selectedPlatforms.includes(platform.id)
                            ? "selected"
                            : ""
                        } ${
                          aiRecommendations?.suggestedPlatforms?.includes(
                            platform.id
                          )
                            ? "border-green-500"
                            : ""
                        } ${!platform.connected ? "opacity-50" : ""}`}
                      >
                        {platform.icon}
                        <div className="text-left">
                          <span>{platform.name}</span>
                          <div className="text-xs">
                            {platform.connected ? (
                              <span className="text-green-400">Connected</span>
                            ) : (
                              <span className="text-red-400">
                                Not Connected
                              </span>
                            )}
                            {aiRecommendations?.suggestedPlatforms?.includes(
                              platform.id
                            ) && (
                              <span className="text-blue-400 ml-1">
                                • AI Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedPlatforms.length > 0 && (
                    <div className="selected-platforms-info">
                      <span className="text-sm text-gray-300">
                        Selected: {selectedPlatforms.length} platform(s)
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={postToSocialMedia}
                  disabled={isPosting || selectedPlatforms.length === 0}
                  className="btn btn-primary btn-full"
                >
                  {isPosting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Publishing with AI Intelligence...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Post with AI Optimization
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Post History */}
            <div className="history-panel">
              <div className="history-header">
                <div className="history-icon">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="history-title">AI-Optimized Posts</h3>
              </div>

              <div className="history-list">
                {posts.length === 0 ? (
                  <div className="empty-state">
                    <Brain className="empty-state-icon" />
                    <p className="empty-state-text">No posts yet</p>
                    <p className="empty-state-text">
                      Start with AI analysis above
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="history-item">
                      <div className="history-item-header">
                        <span className={`status-badge status-${post.status}`}>
                          {post.status}
                        </span>
                        <span className="history-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="history-content">{post.content}</div>

                      <div className="history-platforms">
                        {post.platforms.map((platform) => {
                          const platformInfo = platforms.find(
                            (p) => p.id === platform
                          );
                          return (
                            <span key={platform} className="platform-tag">
                              {platformInfo?.name || platform}
                            </span>
                          );
                        })}
                      </div>

                      {post.aiRecommendations && (
                        <div className="mt-2 text-xs text-gray-400">
                          <div>
                            🎯 AI Targeted:{" "}
                            {post.aiRecommendations.targetAudience?.join(", ")}
                          </div>
                          <div>
                            ⏰ Best Time:{" "}
                            {post.aiRecommendations.bestTimeToPost}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="quick-actions-header">
                <div className="quick-actions-icon">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="quick-actions-title">AI Intelligence</h3>
              </div>

              <div className="quick-actions-list">
                <button className="quick-action-btn">
                  <Target className="w-4 h-4" />
                  <span>Audience Analysis</span>
                </button>
                <button className="quick-action-btn">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trend Analysis</span>
                </button>
                <button className="quick-action-btn">
                  <Users2 className="w-4 h-4" />
                  <span>Group Recommendations</span>
                </button>
                <button className="quick-action-btn">
                  <Calendar className="w-4 h-4" />
                  <span>Optimal Timing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
