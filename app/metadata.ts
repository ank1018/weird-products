import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weird Products - Unique Gifts & Useful Tools",
  description: "Discover unique gifts for men and women, useful products, and fun online tools. Find the perfect present with our personality predictor, IP finder, and more!",
  keywords: [
    "gifts for men",
    "gifts for women",
    "unique gifts",
    "useful products",
    "fun gifts",
    "online tools",
    "personality test",
    "IP finder",
    "JSON formatter",
    "gift ideas",
    "cool gadgets",
    "unusual presents",
    "quirky gifts",
    "practical gifts",
    "tech gifts"
  ].join(", "),
  authors: [{ name: "Weird Products" }],
  openGraph: {
    title: "Weird Products - Unique Gifts & Useful Tools",
    description: "Find unique gifts and useful tools for everyone. Discover our collection of fun and practical products!",
    type: "website",
    locale: "en_US",
    siteName: "Weird Products",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
}; 