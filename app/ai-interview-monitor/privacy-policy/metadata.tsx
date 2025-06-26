import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - AI Interview Monitor",
    description:
        "Privacy Policy for the AI Interview Monitor Chrome extension. Learn how we collect, use, and protect your information during interview monitoring sessions.",
    keywords:
        "privacy policy, AI interview monitor, data protection, GDPR, interview monitoring, Chrome extension privacy, user rights, data retention",
    openGraph: {
        title: "Privacy Policy - AI Interview Monitor",
        description:
            "Privacy Policy for the AI Interview Monitor Chrome extension. Learn about our data collection practices and your privacy rights.",
        images: [],
        locale: "en_US",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
    authors: [{ name: "AI Interview Monitor" }],
    alternates: {
        canonical: "https://www.wackyorwise.com/ai-interview-monitor/privacy-policy",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
}; 