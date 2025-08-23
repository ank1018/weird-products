import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Marketing Agent - Generate & Post Content",
  description:
    "AI-powered marketing agent to generate and post content to social media platforms",
  keywords: "AI marketing, social media, content generation, automation",
};

export default function AIMarketingAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-900 text-white">{children}</div>;
}
