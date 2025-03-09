import type { Metadata } from "next";
import "./globals.css";
import { Sigmar } from "next/font/google";
import {Toaster} from "react-hot-toast";

const sigmar = Sigmar({ subsets: ['latin'], weight: ['400'], variable: '--font-sigmar' });

export const metadata: Metadata = {
  title: "Wacky or Wise - Discover Weird, Confusing & Useful Products",
  description: "Explore the most bizarre, viral, and surprisingly useful products on WackyOrWise.com. Vote on whether they are genius or just plain weird!",
  keywords: [
    "weird products", "unusual gadgets", "confusing items", "useful inventions",
    "bizarre shopping", "funny Amazon Flipkart finds", "quirky gifts", "strange but useful",
    "viral products", "TikTok, reels famous products"
  ].join(", "),
  openGraph: {
    title: "Wacky or Wise - The Most Bizarre & Useful Products Online",
    description: "Find the weirdest yet useful products that will leave you questioning their genius. Vote 'Wacky' or 'Wise' now!",
    url: "https://www.wackyorwise.com",
    siteName: "WackyOrWise",
    images: [
      {
        url: "https://www.wackyorwise.com/images/wow-logo.png",
        width: 900,
        height: 450,
        alt: "Wacky or Wise - Bizarre & Useful Products",
      },
    ],
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Wacky or Wise - The Most Bizarre & Useful Products",
  //   description: "Vote on weird and useful products at WackyOrWise.com. Find quirky gifts and viral gadgets!",
  //   images: ["https://www.wackyorwise.com/images/wow-banner.png"],
  //   site: "@wackyorwise",
  // },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
          {/* Structured Data for SEO */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Wacky or Wise",
                  "url": "https://www.wackyorwise.com",
                  "description": "Explore bizarre, viral, and surprisingly useful products. Vote on whether they are genius or just plain weird!",
                  "publisher": {
                      "@type": "Organization",
                      "name": "WackyOrWise",
                      "logo": "https://www.wackyorwise.com/images/logo.png"
                  }
              })
          }}/>
          <meta name="google-adsense-account" content="ca-pub-2405880474323539"/>
      </head>
      <body className={sigmar.variable}>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
      </body>
      </html>
  );
}
