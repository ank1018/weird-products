import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter | Essential Tool for Developers & Tech Gifts",
  description: "Format and validate JSON data with our easy-to-use tool. Perfect gift for developers, programmers, and tech enthusiasts. A must-have utility for anyone working with JSON data.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "developer tools",
    "programming utilities",
    "tech gifts",
    "coding tools",
    "JSON beautifier",
    "web development",
    "developer gifts",
    "programming tools",
    "gifts for programmers",
    "tech enthusiast gifts",
    "coding gifts",
    "developer utilities",
    "programmer tools"
  ].join(", "),
  openGraph: {
    title: "JSON Formatter | Perfect Gift for Developers",
    description: "A must-have tool for developers and programmers. Format and validate JSON data instantly. Great gift for tech enthusiasts!",
    images: [
      // {
      //   url: '/static/images/json-formatter-preview.png',
      //   width: 1200,
      //   height: 630,
      //   alt: 'JSON Formatter Tool Preview',
      // }
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Weird Products" }],
  alternates: {
    canonical: "https://weird-products.com/json-formatter",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
