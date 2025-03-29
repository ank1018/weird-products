"use client";
import { CSSProperties, useEffect, useState } from "react";
import "./google-ads.css";

interface GoogleAdProps {
  slot: string;
  format?: string;
  style?: CSSProperties;
  className?: string;
  responsive?: boolean;
  layout?: string;
  testMode?: boolean;
}

export default function GoogleAd({
  slot,
  format = "auto",
  style,
  className = "",
  responsive = true,
  layout,
  testMode = process.env.NODE_ENV === "development",
}: GoogleAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Don't try to load ads in test mode
    if (testMode) {
      setIsLoaded(true);
      return;
    }

    try {
      // Define adsbygoogle if it doesn't exist
      window.adsbygoogle = window.adsbygoogle || [];

      // Create a timeout to detect if ads don't load
      const timeoutId = setTimeout(() => {
        if (!isLoaded) {
          setAdError("Ad failed to load within timeout period");
        }
      }, 3000);

      // Push the ad configuration
      window.adsbygoogle.push({
        google_ad_client: "ca-pub-2405880474323539",
        enable_page_level_ads: false,
        params: { google_ad_slot: slot },
        callback: () => {
          clearTimeout(timeoutId);
          setIsLoaded(true);
        },
      });

      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error("AdSense error:", err);
      setAdError(err instanceof Error ? err.message : "Unknown ad error");
    }
  }, [slot, testMode, isLoaded]);

  if (!isClient) {
    return <div className={`ad-container ${className}`} style={style}></div>;
  }

  // Render a placeholder in test mode
  if (testMode) {
    return (
      <div
        className={`ad-container ad-test-mode ${className}`}
        style={{
          background: "#f0f0f0",
          border: "1px dashed #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          ...style,
        }}
      >
        <div>
          <div>Ad Placeholder</div>
          <div>Slot: {slot}</div>
          <div>Format: {format}</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (adError) {
    return (
      <div
        className={`ad-container ad-error ${className}`}
        style={{ display: "none" }}
      >
        {/* Hidden error container */}
      </div>
    );
  }

  // Actual ad component
  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={"ca-pub-2405880474323539"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
