import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Personality Predictor | Find Perfect Gifts Based on Personality",
  description: "Discover unique gift ideas based on personality traits. Our AI-powered personality test helps you find the perfect gifts for men and women. Great for birthdays, holidays, and special occasions!",
  keywords: [
    "personality test",
    "gift ideas by personality",
    "unique gifts",
    "personality based gifts",
    "gifts for personality types",
    "fun personality quiz",
    "gift finder",
    "personalized gifts",
    "quirky gifts",
    "unusual presents",
    "gifts for men",
    "gifts for women",
    "birthday gifts",
    "holiday gifts",
    "special occasion gifts"
  ].join(", "),
  openGraph: {
    title: "Personality Predictor | Find Perfect Gifts Based on Personality",
    description: "Take our fun personality test to discover unique gift ideas perfect for any personality type. Great for finding gifts for men and women!",
    images: [
      // {
      //   url: '/static/images/personality-predictor-preview.png',
      //   width: 1200,
      //   height: 630,
      //   alt: 'Personality Predictor Tool Preview',
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
    canonical: "https://weird-products.com/personality-predictor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
