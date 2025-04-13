import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: 'Shadow Shapes - Fun Shape Matching Game',
  description: 'Test your reflexes and shape recognition skills in this engaging shadow shapes matching game. Match shapes with their shadows, earn points, and beat your high score!',
  keywords: ['shadow shapes', 'shape matching game', 'puzzle game', 'reflex game', 'shape recognition', 'mobile game', 'browser game'],
  openGraph: {
    title: 'Shadow Shapes - Fun Shape Matching Game',
    description: 'Test your reflexes and shape recognition skills in this engaging shadow shapes matching game. Match shapes with their shadows, earn points, and beat your high score!',
    type: 'website',
    url: 'https://weird-products.com/shadow-shapes',
    images: [
      {
        url: '/images/shadow-shapes-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Shadow Shapes Game Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadow Shapes - Fun Shape Matching Game',
    description: 'Test your reflexes and shape recognition skills in this engaging shadow shapes matching game!',
    images: ['/images/shadow-shapes-preview.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };