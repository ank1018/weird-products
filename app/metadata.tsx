import { Metadata, Viewport } from "next";

// Default metadata for the site
export const defaultMetadata: Metadata = {
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

// Page-specific metadata
export const pageMetadata = {
  personalityPredictor: {
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
    canonical: "https://weird-products.com/personality-predictor"
  },
  findMyIp: {
    title: "Find My IP Address | Detailed Browser, Network & Location Information",
    description: "Discover your public IP address along with comprehensive details about your location, browser, and network connection. Learn about your country, region, city, and more to understand your online footprint and enhance your digital privacy.",
    keywords: "IP address, find my IP, browser information, network details, online privacy, IP lookup, location, device info, internet security",
    canonical: "https://www.wackyorwise.com/find-my-ip"
  }
};

// Function to generate product-specific metadata
export async function generateProductMetadata(product: any) {
  if (!product) return defaultMetadata;

  const imageUrls = product.images
    ? product.images.split(",").map((url: string) => url.trim())
    : [];
  const firstImageUrl =
    imageUrls.length > 0
      ? imageUrls[0].replace(/^"|"$/g, "")
      : "https://www.wackyorwise.com/images/wow-logo.png";

  return {
    title: `${product.name} - Wacky or Wise`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Wacky or Wise`,
      description: product.description,
      images: [
        {
          url: firstImageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

// Common viewport settings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}; 