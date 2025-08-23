"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Brain,
  Twitter,
  Linkedin,
  Send,
  MessageCircle,
  Hash,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface IntegrationStatus {
  ai: {
    openai: boolean;
    scraping: boolean;
  };
  social: {
    twitter: boolean;
    linkedin: boolean;
    telegram: boolean;
    reddit: boolean;
    hackernews: boolean;
  };
}

export default function IntegrationStatus() {
  const [status, setStatus] = useState<IntegrationStatus>({
    ai: { openai: false, scraping: false },
    social: {
      twitter: false,
      linkedin: false,
      telegram: false,
      reddit: false,
      hackernews: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    setIsLoading(true);

    // Check AI integrations
    const aiStatus = {
      openai: !!process.env.NEXT_PUBLIC_OPENAI_CONFIGURED || false,
      scraping: !!process.env.NEXT_PUBLIC_SCRAPING_CONFIGURED || false,
    };

    // Check social media integrations
    const socialStatus = {
      twitter: !!process.env.NEXT_PUBLIC_TWITTER_CONFIGURED || false,
      linkedin: !!process.env.NEXT_PUBLIC_LINKEDIN_CONFIGURED || false,
      telegram: !!process.env.NEXT_PUBLIC_TELEGRAM_CONFIGURED || false,
      reddit: !!process.env.NEXT_PUBLIC_REDDIT_CONFIGURED || false,
      hackernews: true, // Always available (manual submission)
    };

    setStatus({ ai: aiStatus, social: socialStatus });
    setIsLoading(false);
  };

  const getStatusIcon = (isConfigured: boolean) => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return isConfigured ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusText = (isConfigured: boolean, platform: string) => {
    if (isLoading) return "Checking...";
    return isConfigured ? "Configured" : "Not configured";
  };

  const getSetupLink = (platform: string) => {
    const links = {
      openai: "https://platform.openai.com/api-keys",
      twitter: "https://developer.twitter.com/en/portal/dashboard",
      linkedin: "https://www.linkedin.com/developers/",
      telegram: "https://core.telegram.org/bots#how-do-i-create-a-bot",
      reddit: "https://www.reddit.com/prefs/apps",
      scraping: "https://www.scrapingbee.com/",
    };
    return links[platform as keyof typeof links] || "#";
  };

  const getSetupInstructions = (platform: string) => {
    const instructions = {
      openai: "Get your API key from OpenAI Platform",
      twitter: "Create a Twitter Developer app and get API keys",
      linkedin:
        "Create a LinkedIn app and request Marketing Developer Platform access",
      telegram: "Create a bot with @BotFather and get the token",
      reddit: "Create a Reddit app and configure OAuth2",
      scraping: "Sign up for ScrapingBee or use Puppeteer",
    };
    return instructions[platform as keyof typeof instructions] || "";
  };

  return (
    <div className="integration-status">
      <div className="status-header">
        <div className="status-title">
          <Settings className="w-5 h-5" />
          <h3>Integration Status</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="toggle-details"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* AI Integrations */}
      <div className="integration-section">
        <div className="section-header">
          <Brain className="w-4 h-4" />
          <h4>AI Capabilities</h4>
        </div>

        <div className="integration-grid">
          <div className="integration-item">
            <div className="integration-info">
              <span className="integration-name">OpenAI GPT-4</span>
              <span className="integration-status">
                {getStatusIcon(status.ai.openai)}
                {getStatusText(status.ai.openai, "openai")}
              </span>
            </div>
            {showDetails && !status.ai.openai && (
              <div className="integration-details">
                <p>{getSetupInstructions("openai")}</p>
                <a
                  href={getSetupLink("openai")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>

          <div className="integration-item">
            <div className="integration-info">
              <span className="integration-name">Website Scraping</span>
              <span className="integration-status">
                {getStatusIcon(status.ai.scraping)}
                {getStatusText(status.ai.scraping, "scraping")}
              </span>
            </div>
            {showDetails && !status.ai.scraping && (
              <div className="integration-details">
                <p>{getSetupInstructions("scraping")}</p>
                <a
                  href={getSetupLink("scraping")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Integrations */}
      <div className="integration-section">
        <div className="section-header">
          <Send className="w-4 h-4" />
          <h4>Social Media Platforms</h4>
        </div>

        <div className="integration-grid">
          <div className="integration-item">
            <div className="integration-info">
              <Twitter className="w-4 h-4" />
              <span className="integration-name">Twitter</span>
              <span className="integration-status">
                {getStatusIcon(status.social.twitter)}
                {getStatusText(status.social.twitter, "twitter")}
              </span>
            </div>
            {showDetails && !status.social.twitter && (
              <div className="integration-details">
                <p>{getSetupInstructions("twitter")}</p>
                <a
                  href={getSetupLink("twitter")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>

          <div className="integration-item">
            <div className="integration-info">
              <Linkedin className="w-4 h-4" />
              <span className="integration-name">LinkedIn</span>
              <span className="integration-status">
                {getStatusIcon(status.social.linkedin)}
                {getStatusText(status.social.linkedin, "linkedin")}
              </span>
            </div>
            {showDetails && !status.social.linkedin && (
              <div className="integration-details">
                <p>{getSetupInstructions("linkedin")}</p>
                <a
                  href={getSetupLink("linkedin")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>

          <div className="integration-item">
            <div className="integration-info">
              <Send className="w-4 h-4" />
              <span className="integration-name">Telegram</span>
              <span className="integration-status">
                {getStatusIcon(status.social.telegram)}
                {getStatusText(status.social.telegram, "telegram")}
              </span>
            </div>
            {showDetails && !status.social.telegram && (
              <div className="integration-details">
                <p>{getSetupInstructions("telegram")}</p>
                <a
                  href={getSetupLink("telegram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>

          <div className="integration-item">
            <div className="integration-info">
              <MessageCircle className="w-4 h-4" />
              <span className="integration-name">Reddit</span>
              <span className="integration-status">
                {getStatusIcon(status.social.reddit)}
                {getStatusText(status.social.reddit, "reddit")}
              </span>
            </div>
            {showDetails && !status.social.reddit && (
              <div className="integration-details">
                <p>{getSetupInstructions("reddit")}</p>
                <a
                  href={getSetupLink("reddit")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Setup Guide
                </a>
              </div>
            )}
          </div>

          <div className="integration-item">
            <div className="integration-info">
              <Hash className="w-4 h-4" />
              <span className="integration-name">Hacker News</span>
              <span className="integration-status">
                {getStatusIcon(status.social.hackernews)}
                Manual Submission
              </span>
            </div>
            {showDetails && (
              <div className="integration-details">
                <p>
                  Hacker News requires manual submission. AI will provide
                  optimized content and submission links.
                </p>
                <a
                  href="https://news.ycombinator.com/submit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="setup-link"
                >
                  <ExternalLink className="w-3 h-3" />
                  Submit to HN
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="integration-summary">
        <div className="summary-item">
          <span>AI Capabilities:</span>
          <span
            className={`summary-status ${
              Object.values(status.ai).some(Boolean)
                ? "configured"
                : "not-configured"
            }`}
          >
            {Object.values(status.ai).filter(Boolean).length}/
            {Object.keys(status.ai).length} configured
          </span>
        </div>
        <div className="summary-item">
          <span>Social Platforms:</span>
          <span
            className={`summary-status ${
              Object.values(status.social).some(Boolean)
                ? "configured"
                : "not-configured"
            }`}
          >
            {Object.values(status.social).filter(Boolean).length}/
            {Object.keys(status.social).length} configured
          </span>
        </div>
      </div>

      {/* Setup CTA */}
      {(!Object.values(status.ai).some(Boolean) ||
        !Object.values(status.social).some(Boolean)) && (
        <div className="setup-cta">
          <AlertCircle className="w-4 h-4" />
          <p>
            Configure integrations to unlock full AI-powered marketing
            capabilities
          </p>
          <a
            href="/ai-marketing-agent/SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="setup-guide-link"
          >
            <ExternalLink className="w-3 h-3" />
            Complete Setup Guide
          </a>
        </div>
      )}

      <style jsx>{`
        .integration-status {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .status-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #ffffff;
        }

        .toggle-details {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.5rem 1rem;
          color: #a0aec0;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-details:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .integration-section {
          margin-bottom: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #a0aec0;
        }

        .integration-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .integration-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
        }

        .integration-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .integration-name {
          flex: 1;
          font-weight: 500;
          color: #e2e8f0;
        }

        .integration-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #a0aec0;
        }

        .integration-details {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .integration-details p {
          font-size: 0.875rem;
          color: #a0aec0;
          margin-bottom: 0.5rem;
        }

        .setup-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #667eea;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .setup-link:hover {
          color: #764ba2;
        }

        .integration-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .summary-item:last-child {
          margin-bottom: 0;
        }

        .summary-status {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .summary-status.configured {
          color: #4ade80;
        }

        .summary-status.not-configured {
          color: #f87171;
        }

        .setup-cta {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
        }

        .setup-cta p {
          color: #fbbf24;
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .setup-guide-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #fbbf24;
          font-size: 0.875rem;
          text-decoration: none;
          font-weight: 600;
        }

        .setup-guide-link:hover {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
}
