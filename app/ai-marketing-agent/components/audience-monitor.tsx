"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Activity,
  TrendingUp,
  Search,
  Globe,
  Target,
  BarChart3,
  Zap,
  AlertTriangle,
  MessageCircle,
  Hash,
  Eye,
  DollarSign,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  MessageSquare,
  ThumbsUp,
  Share2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

interface MonitoringRule {
  id: string;
  name: string;
  type: "keyword" | "brand" | "opportunity" | "engagement";
  status: "active" | "inactive" | "learning";
  keywords?: string[];
  platforms: string[];
  lastCheck: Date;
  results?: any;
  alertType: "realtime" | "daily" | "weekly";
}

interface ForumAlert {
  id: string;
  platform: string;
  content: string;
  author: string;
  timestamp: Date;
  type: "keyword" | "brand" | "opportunity";
  sentiment: "positive" | "negative" | "neutral";
  engagement: number;
  url: string;
  isLead: boolean;
}

interface LeadOpportunity {
  id: string;
  platform: string;
  user: string;
  content: string;
  intent: "buying" | "researching" | "complaining" | "recommending";
  contactInfo?: string;
  timestamp: Date;
  score: number;
}

interface AudienceMonitorProps {
  websiteUrl?: string;
  keywords?: string[];
}

export default function AudienceMonitor({
  websiteUrl,
  keywords,
}: AudienceMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [rules, setRules] = useState<MonitoringRule[]>([
    {
      id: "1",
      name: "Brand Mentions",
      type: "brand",
      status: "active",
      keywords: ["WeirdProducts", "weird-products", "@WeirdProducts"],
      platforms: ["reddit", "twitter", "linkedin", "facebook"],
      lastCheck: new Date(),
      alertType: "realtime",
    },
    {
      id: "2",
      name: "AI Marketing Keywords",
      type: "keyword",
      status: "active",
      keywords: ["AI marketing", "automation", "social media tools"],
      platforms: ["reddit", "twitter", "linkedin", "hackernews"],
      lastCheck: new Date(),
      alertType: "realtime",
    },
    {
      id: "3",
      name: "Sales Opportunities",
      type: "opportunity",
      status: "active",
      keywords: ["looking for", "need help", "recommend", "best tool"],
      platforms: ["reddit", "twitter", "linkedin", "facebook"],
      lastCheck: new Date(),
      alertType: "realtime",
    },
  ]);
  const [alerts, setAlerts] = useState<ForumAlert[]>([]);
  const [leads, setLeads] = useState<LeadOpportunity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "reddit",
    "twitter",
    "linkedin",
  ]);
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

  // Auto-start monitoring when website URL and keywords are available
  useEffect(() => {
    if (websiteUrl && keywords && keywords.length > 0 && !isMonitoring) {
      startMonitoring();
    }
  }, [websiteUrl, keywords]);

  const startMonitoring = async () => {
    if (!websiteUrl?.trim()) {
      toast.error("Please analyze a website first to start monitoring");
      return;
    }

    setIsMonitoring(true);
    setIsAnalyzing(true);

    try {
      // Start AI-driven forum monitoring
      const response = await fetch(
        "/api/ai-marketing-agent/audience-monitoring",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            websiteUrl,
            action: "start_monitoring",
            platforms: selectedPlatforms,
            keywords: keywords || [],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update with real forum data
        if (data.alerts) {
          setAlerts(data.alerts);
        }

        if (data.leads) {
          setLeads(data.leads);
        }

        // Update rules with extracted keywords
        if (data.keywords) {
          setRules((prev) =>
            prev.map((rule) =>
              rule.type === "keyword"
                ? {
                    ...rule,
                    keywords: data.keywords,
                    status: "active" as const,
                  }
                : rule
            )
          );
        }

        toast.success(
          "AI monitoring started! Scanning forums for opportunities."
        );
      } else {
        throw new Error("Failed to start monitoring");
      }
    } catch (error) {
      console.error("Error starting monitoring:", error);
      toast.error("Failed to start monitoring. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast.success("Monitoring stopped");
  };

  const refreshAlerts = async () => {
    if (!websiteUrl) {
      toast.error("Please analyze a website first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `/api/ai-marketing-agent/audience-monitoring?action=alerts&websiteUrl=${encodeURIComponent(
          websiteUrl
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
        setLeads(data.leads || []);
        toast.success(`Found ${data.alerts?.length || 0} new alerts`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to refresh alerts");
      }
    } catch (error) {
      toast.error("Failed to refresh alerts");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testMonitoring = async () => {
    if (!websiteUrl) {
      toast.error("Please analyze a website first");
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log("Testing monitoring functionality...");

      // Test simple endpoint first
      const simpleTest = await fetch(
        "/api/ai-marketing-agent/audience-monitoring?action=simple-test"
      );
      console.log("Simple test response:", await simpleTest.json());

      // Test full monitoring with website URL
      const testResponse = await fetch(
        `/api/ai-marketing-agent/audience-monitoring?action=test&websiteUrl=${encodeURIComponent(
          websiteUrl
        )}`
      );
      const testData = await testResponse.json();

      console.log("Test response:", testData);

      if (testData.success) {
        setAlerts(testData.alerts || []);
        setLeads(testData.leads || []);
        toast.success(
          `Test completed! Found ${testData.alerts?.length || 0} alerts and ${
            testData.leads?.length || 0
          } leads`
        );
      } else {
        toast.error(`Test failed: ${testData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Test failed - check console for details");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addMonitoringRule = () => {
    const newRule: MonitoringRule = {
      id: Date.now().toString(),
      name: `Custom Rule ${rules.length + 1}`,
      type: "keyword",
      status: "inactive",
      keywords: keywords || [],
      platforms: selectedPlatforms,
      lastCheck: new Date(),
      alertType: "realtime",
    };
    setRules([...rules, newRule]);
    toast.success("New monitoring rule added");
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "reddit":
        return <MessageCircle className="w-4 h-4" />;
      case "twitter":
        return <Hash className="w-4 h-4" />;
      case "linkedin":
        return <Globe className="w-4 h-4" />;
      case "facebook":
        return <Users className="w-4 h-4" />;
      case "hackernews":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const toggleAlertExpansion = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const toggleLeadExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedLeads);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeads(newExpanded);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "buying":
        return "bg-green-500";
      case "researching":
        return "bg-blue-500";
      case "complaining":
        return "bg-red-500";
      case "recommending":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="audience-monitor">
      <div className="monitor-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="header-title">AI-Driven Forum Monitoring</h2>
              <p className="header-subtitle">
                Real-time monitoring of forums, social media, and communities
                for brand mentions, keywords, and sales opportunities
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={addMonitoringRule}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </button>
          </div>
        </div>
      </div>

      {/* Status and Controls */}
      <div className="form-group mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Status:{" "}
              {isMonitoring ? (
                <span className="text-green-400">Monitoring Active</span>
              ) : (
                <span className="text-gray-400">Inactive</span>
              )}
            </span>
            {websiteUrl && (
              <span className="text-sm text-gray-300">
                Monitoring: {websiteUrl}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              disabled={isAnalyzing || !websiteUrl}
              className="btn btn-primary"
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner"></div>
                  Scanning Forums...
                </>
              ) : isMonitoring ? (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </button>
            <button
              onClick={refreshAlerts}
              disabled={isAnalyzing || !websiteUrl}
              className="btn btn-secondary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={testMonitoring}
              disabled={isAnalyzing}
              className="btn btn-secondary"
            >
              <Search className="w-4 h-4 mr-2" />
              Test
            </button>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="form-group mb-6">
        <label className="form-label">Monitor Platforms</label>
        <div className="flex flex-wrap gap-2">
          {["reddit", "twitter", "linkedin", "facebook", "hackernews"].map(
            (platform) => (
              <button
                key={platform}
                onClick={() =>
                  setSelectedPlatforms((prev) =>
                    prev.includes(platform)
                      ? prev.filter((p) => p !== platform)
                      : [...prev, platform]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedPlatforms.includes(platform)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {getPlatformIcon(platform)}
                <span className="ml-1 capitalize">{platform}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Live Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section mb-6">
          <div className="section-header">
            <h3 className="section-title">Live Alerts ({alerts.length})</h3>
            <p className="text-sm text-gray-400">
              Real-time mentions and discussions
            </p>
          </div>
          <div className="alerts-list space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="alert-card bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div
                  className="alert-header p-4 cursor-pointer"
                  onClick={() => toggleAlertExpansion(alert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(alert.platform)}
                        <span className="text-sm font-medium capitalize text-gray-200">
                          {alert.platform}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          alert.type === "brand"
                            ? "bg-blue-500"
                            : alert.type === "opportunity"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } text-white`}
                      >
                        {alert.type}
                      </span>
                      {alert.isLead && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs ${getSentimentColor(
                          alert.sentiment
                        )}`}
                      >
                        {alert.sentiment}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                      {expandedAlerts.has(alert.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Preview content */}
                  <p className="alert-preview text-sm text-gray-300 mt-2 line-clamp-2">
                    {alert.content.length > 150
                      ? `${alert.content.substring(0, 150)}...`
                      : alert.content}
                  </p>
                </div>

                {/* Expanded content */}
                {expandedAlerts.has(alert.id) && (
                  <div className="alert-expanded p-4 border-t border-gray-700 bg-gray-750">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {alert.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {alert.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {alert.engagement} engagement
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={alert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Post
                          </a>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors">
                            <Share2 className="w-3 h-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Opportunities */}
      {leads.length > 0 && (
        <div className="leads-section mb-6">
          <div className="section-header">
            <h3 className="section-title">
              Lead Opportunities ({leads.length})
            </h3>
            <p className="text-sm text-gray-400">
              High-potential prospects for engagement
            </p>
          </div>
          <div className="leads-list space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="lead-card bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div
                  className="lead-header p-4 cursor-pointer"
                  onClick={() => toggleLeadExpansion(lead.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(lead.platform)}
                        <span className="text-sm font-medium text-gray-200">
                          {lead.user}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getIntentColor(
                          lead.intent
                        )} text-white`}
                      >
                        {lead.intent}
                      </span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">
                          Score: {lead.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(lead.timestamp)}
                      </span>
                      {expandedLeads.has(lead.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Preview content */}
                  <p className="lead-preview text-sm text-gray-300 mt-2 line-clamp-2">
                    {lead.content.length > 150
                      ? `${lead.content.substring(0, 150)}...`
                      : lead.content}
                  </p>
                </div>

                {/* Expanded content */}
                {expandedLeads.has(lead.id) && (
                  <div className="lead-expanded p-4 border-t border-gray-700 bg-gray-750">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {lead.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {lead.contactInfo && (
                            <div className="flex items-center gap-2">
                              {lead.contactInfo.includes("@") ? (
                                <Mail className="w-3 h-3" />
                              ) : lead.contactInfo.includes("+") ? (
                                <Phone className="w-3 h-3" />
                              ) : (
                                <MapPin className="w-3 h-3" />
                              )}
                              <span>{lead.contactInfo}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                            <MessageSquare className="w-3 h-3" />
                            Engage
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors">
                            <DollarSign className="w-3 h-3" />
                            Convert
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors">
                            <Share2 className="w-3 h-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!alerts.length && !leads.length && isMonitoring && (
        <div className="no-data-state mb-6">
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No Alerts Found
            </h3>
            <p className="text-gray-400 text-sm">
              Monitoring is active but no relevant discussions found yet. Try
              refreshing or expanding your keyword search.
            </p>
          </div>
        </div>
      )}

      <div className="rules-section">
        <div className="section-header">
          <h3 className="section-title">Monitoring Rules</h3>
        </div>

        <div className="rules-grid">
          {rules.map((rule) => (
            <div key={rule.id} className="rule-card">
              <div className="rule-header">
                <h4 className="rule-name">{rule.name}</h4>
                <span
                  className={`rule-status ${
                    rule.status === "active"
                      ? "bg-green-500"
                      : rule.status === "learning"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  } text-white rounded px-2 py-1 text-xs`}
                >
                  {rule.status}
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {rule.type === "keyword" && rule.keywords && (
                  <>Keywords: {rule.keywords.join(", ")}</>
                )}
                {rule.type === "brand" && (
                  <>Monitor brand mentions and reputation</>
                )}
                {rule.type === "opportunity" && (
                  <>Track sales opportunities and leads</>
                )}
                {rule.type === "engagement" && (
                  <>Monitor engagement and sentiment</>
                )}
              </p>
              <div className="flex items-center mt-3 text-sm text-gray-400">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span>Last check: {rule.lastCheck.toLocaleTimeString()}</span>
              </div>
              {rule.platforms && (
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <Target className="w-4 h-4 mr-2" />
                  <span>{rule.platforms.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
