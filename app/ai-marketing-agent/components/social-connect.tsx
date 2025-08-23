"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Twitter,
  Linkedin,
  Send,
  MessageCircle,
  Hash,
  CheckCircle,
  XCircle,
  ExternalLink,
  Settings,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import AuthRequired from "./auth-required";

interface SocialAccount {
  platform: string;
  connected: boolean;
  username?: string;
  name?: string;
  lastConnected?: Date;
}

export default function SocialConnect() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { platform: "twitter", connected: false },
    { platform: "linkedin", connected: false },
    { platform: "telegram", connected: false },
    { platform: "reddit", connected: false },
    { platform: "hackernews", connected: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [telegramSetup, setTelegramSetup] = useState<any>(null);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramForm, setTelegramForm] = useState({
    botToken: "",
    channelId: "",
  });

  useEffect(() => {
    loadConnectedAccounts();
    checkOAuthResult();
  }, []);

  const checkOAuthResult = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const success = urlParams.get("success");
    const username = urlParams.get("username");
    const message = urlParams.get("message");

    if (error === "twitter_oauth_failed") {
      toast.error(message || "Twitter OAuth failed. Please try again.");
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === "twitter_connected" && username) {
      // Update Twitter account as connected
      const newAccounts = accounts.map((acc) =>
        acc.platform === "twitter"
          ? {
              ...acc,
              connected: true,
              username: `@${username}`,
              lastConnected: new Date(),
            }
          : acc
      );
      saveAccounts(newAccounts);
      toast.success(`Twitter connected successfully as @${username}!`);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const loadConnectedAccounts = async () => {
    try {
      // In production, fetch from API
      // For now, we'll use localStorage to persist connections
      const saved = localStorage.getItem("socialAccounts");
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  const saveAccounts = (newAccounts: SocialAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem("socialAccounts", JSON.stringify(newAccounts));
  };

  const connectTwitter = async () => {
    setIsLoading(true);
    setActivePlatform("twitter");

    try {
      const response = await fetch(
        "/api/ai-marketing-agent/social-auth/twitter?action=connect"
      );
      const data = await response.json();

      if (data.success) {
        // Open Twitter OAuth in new window
        window.open(
          data.authUrl,
          "_blank",
          "width=600,height=600"
        );
        
        // Reset loading state after opening the window
        setIsLoading(false);
        setActivePlatform(null);
        
        // Show a message to the user
        toast.success("Twitter OAuth window opened. Please complete the authorization.");
      } else if (data.requiresAuth) {
        toast.error("Please sign in to connect your social media accounts.");
        setIsLoading(false);
        setActivePlatform(null);
      } else {
        toast.error(data.error || "Failed to connect Twitter");
        setIsLoading(false);
        setActivePlatform(null);
      }
    } catch (error) {
      console.error("Twitter connection error:", error);
      toast.error("Failed to connect Twitter. Please try again.");
      setIsLoading(false);
      setActivePlatform(null);
    }
  };

  const connectLinkedIn = async () => {
    setIsLoading(true);
    setActivePlatform("linkedin");

    try {
      const response = await fetch(
        "/api/ai-marketing-agent/social-auth/linkedin?action=connect"
      );
      const data = await response.json();

      if (data.success) {
        // Open LinkedIn OAuth in new window
        const authWindow = window.open(
          data.authUrl,
          "_blank",
          "width=600,height=600"
        );

        // Check OAuth completion status
        const checkOAuthStatus = async () => {
          try {
            const statusResponse = await fetch(
              "/api/ai-marketing-agent/social-auth/linkedin?action=verify"
            );
            const statusData = await statusResponse.json();

            if (statusData.connected) {
              // OAuth was successful
              const newAccounts = accounts.map((acc) =>
                acc.platform === "linkedin"
                  ? {
                      ...acc,
                      connected: true,
                      name: statusData.name || "User",
                      lastConnected: new Date(),
                    }
                  : acc
              );
              saveAccounts(newAccounts);
              setIsLoading(false);
              setActivePlatform(null);
              toast.success("LinkedIn connected successfully!");
            } else {
              // OAuth failed or was cancelled
              setIsLoading(false);
              setActivePlatform(null);
              toast.error(
                "LinkedIn OAuth failed. The app may not have proper permissions or the OAuth was cancelled."
              );
            }
          } catch (error) {
            console.error("Error checking OAuth status:", error);
            setIsLoading(false);
            setActivePlatform(null);
            toast.error("Failed to verify LinkedIn connection.");
          }
        };

        // Check status after a delay to allow OAuth to complete
        setTimeout(checkOAuthStatus, 3000);
      } else if (data.requiresAuth) {
        alert("Please sign in to connect your social media accounts.");
        setIsLoading(false);
        setActivePlatform(null);
      } else {
        alert(data.error || "Failed to connect LinkedIn");
        setIsLoading(false);
        setActivePlatform(null);
      }
    } catch (error) {
      console.error("LinkedIn connection error:", error);
      alert("Failed to connect LinkedIn. Please try again.");
      setIsLoading(false);
      setActivePlatform(null);
    }
  };

  const setupTelegram = async () => {
    try {
      const response = await fetch(
        "/api/ai-marketing-agent/social-auth/telegram?action=setup"
      );
      const data = await response.json();

      if (data.success) {
        setTelegramSetup(data.setupInstructions);
        setShowTelegramModal(true);
      }
    } catch (error) {
      console.error("Telegram setup error:", error);
    }
  };

  const connectTelegram = async () => {
    if (!telegramForm.botToken || !telegramForm.channelId) {
      alert("Please enter both bot token and channel ID");
      return;
    }

    setIsLoading(true);
    setActivePlatform("telegram");

    try {
      const response = await fetch(
        "/api/ai-marketing-agent/social-auth/telegram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telegramForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        const newAccounts = accounts.map((acc) =>
          acc.platform === "telegram"
            ? {
                ...acc,
                connected: true,
                username: data.bot.username,
                lastConnected: new Date(),
              }
            : acc
        );
        saveAccounts(newAccounts);
        setShowTelegramModal(false);
        setTelegramForm({ botToken: "", channelId: "" });
      } else {
        alert(data.error || "Failed to connect Telegram");
      }
    } catch (error) {
      console.error("Telegram connection error:", error);
      alert("Failed to connect Telegram bot");
    } finally {
      setIsLoading(false);
      setActivePlatform(null);
    }
  };

  const disconnectAccount = async (platform: string) => {
    try {
      const response = await fetch(
        `/api/ai-marketing-agent/social-auth/${platform}?action=disconnect`
      );
      const data = await response.json();

      if (data.success) {
        const newAccounts = accounts.map((acc) =>
          acc.platform === platform
            ? { ...acc, connected: false, username: undefined, name: undefined }
            : acc
        );
        saveAccounts(newAccounts);
        toast.success(`${getPlatformName(platform)} disconnected successfully`);
      } else {
        toast.error(`Failed to disconnect ${getPlatformName(platform)}`);
      }
    } catch (error) {
      console.error(`Disconnect ${platform} error:`, error);
      toast.error(`Failed to disconnect ${getPlatformName(platform)}`);
    }
  };

  const clearFailedConnection = (platform: string) => {
    const newAccounts = accounts.map((acc) =>
      acc.platform === platform
        ? { ...acc, connected: false, username: undefined, name: undefined }
        : acc
    );
    saveAccounts(newAccounts);
    toast.info(
      `${getPlatformName(
        platform
      )} connection reset. You can try connecting again.`
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "telegram":
        return <Send className="w-5 h-5" />;
      case "reddit":
        return <MessageCircle className="w-5 h-5" />;
      case "hackernews":
        return <Hash className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "Twitter";
      case "linkedin":
        return "LinkedIn";
      case "telegram":
        return "Telegram";
      case "reddit":
        return "Reddit";
      case "hackernews":
        return "Hacker News";
      default:
        return platform;
    }
  };

  // Show auth required if not signed in
  if (!session) {
    return <AuthRequired feature="connect social media accounts" />;
  }

  return (
    <div className="social-connect">
      <div className="connect-header">
        <Settings className="w-5 h-5" />
        <h3>Connect Social Media Accounts</h3>
      </div>

      <div className="connect-info">
        <AlertCircle className="w-4 h-4" />
        <span>
          <strong>Note:</strong> OAuth requires proper app setup with
          Twitter/LinkedIn. If OAuth fails, use the reset button (↻) to clear
          the status and try again.
        </span>
      </div>

      <div className="accounts-grid">
        {accounts.map((account) => (
          <div key={account.platform} className="account-card">
            <div className="account-info">
              {getPlatformIcon(account.platform)}
              <div className="account-details">
                <span className="platform-name">
                  {getPlatformName(account.platform)}
                </span>
                {account.connected && (
                  <span className="account-user">
                    {account.username || account.name || "Connected"}
                  </span>
                )}
              </div>
              <div className="account-status">
                {account.connected ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="account-actions">
              {account.connected ? (
                <button
                  onClick={() => disconnectAccount(account.platform)}
                  className="btn btn-secondary btn-sm"
                  disabled={isLoading}
                >
                  Disconnect
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (account.platform === "twitter") connectTwitter();
                      else if (account.platform === "linkedin")
                        connectLinkedIn();
                      else if (account.platform === "telegram") setupTelegram();
                      else if (account.platform === "reddit")
                        alert("Reddit OAuth coming soon!");
                      else if (account.platform === "hackernews")
                        alert("Hacker News uses manual submission");
                    }}
                    className="btn btn-primary btn-sm"
                    disabled={isLoading && activePlatform === account.platform}
                  >
                    {isLoading && activePlatform === account.platform ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>

                  {/* Reset button for failed connections */}
                  <button
                    onClick={() => clearFailedConnection(account.platform)}
                    className="btn btn-outline btn-sm"
                    title="Reset connection status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Setup Modal */}
      {showTelegramModal && telegramSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Setup Telegram Bot</h3>
              <button
                onClick={() => setShowTelegramModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="setup-instructions">
                <h4>Follow these steps:</h4>
                <ol>
                  {telegramSetup.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="setup-form">
                <div className="form-group">
                  <label>Bot Token</label>
                  <input
                    type="text"
                    placeholder={telegramSetup.botTokenPlaceholder}
                    value={telegramForm.botToken}
                    onChange={(e) =>
                      setTelegramForm({
                        ...telegramForm,
                        botToken: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Channel ID</label>
                  <input
                    type="text"
                    placeholder={telegramSetup.channelPlaceholder}
                    value={telegramForm.channelId}
                    onChange={(e) =>
                      setTelegramForm({
                        ...telegramForm,
                        channelId: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowTelegramModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={connectTelegram}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect Bot"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .social-connect {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .connect-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #ffffff;
        }

        .accounts-grid {
          display: grid;
          gap: 1rem;
        }

        .account-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .account-details {
          flex: 1;
        }

        .platform-name {
          display: block;
          font-weight: 500;
          color: #e2e8f0;
        }

        .account-user {
          display: block;
          font-size: 0.875rem;
          color: #a0aec0;
        }

        .account-status {
          display: flex;
          align-items: center;
        }

        .account-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-close {
          background: none;
          border: none;
          color: #a0aec0;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
        }

        .setup-instructions {
          margin-bottom: 1.5rem;
        }

        .setup-instructions h4 {
          color: #ffffff;
          margin-bottom: 0.75rem;
        }

        .setup-instructions ol {
          color: #a0aec0;
          padding-left: 1.5rem;
        }

        .setup-instructions li {
          margin-bottom: 0.5rem;
        }

        .setup-form {
          margin-bottom: 1.5rem;
        }

        .modal-footer {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
