"use client";

import { AlertCircle, Info } from "lucide-react";

export default function DemoModeBanner() {
  return (
    <div className="demo-banner">
      <div className="banner-content">
        <Info className="w-5 h-5" />
        <div className="banner-text">
          <strong>Authentication Required</strong>
          <span>
            Please sign in with your Google account to connect social media accounts 
            and use all AI features. Your data will be securely stored.
          </span>
        </div>
      </div>

      <style jsx>{`
        .demo-banner {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 51, 234, 0.1) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .banner-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .banner-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .banner-text strong {
          color: #3b82f6;
          font-weight: 600;
        }

        .banner-text span {
          color: #a0aec0;
          font-size: 0.875rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
