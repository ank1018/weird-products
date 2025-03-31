import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "AI Personality Detector | Discover Your Personality with Fun Quizzes",
  description:
    "Uncover your personality traits using our fun and intelligent AI-powered quiz. Built with psychology-inspired questions and smart sentiment analysis. Try it free and find out who you really are!",
  keywords:
    "AI personality quiz, personality test, fun quiz, AI quiz, psychology quiz, sentiment analysis, personality traits, personality detector, free online quiz, MBTI AI, extrovert introvert quiz, agreeableness, conscientiousness, openness test, online personality analyzer",
  openGraph: {
    title: "AI Personality Detector | Discover Your Personality with Fun Quizzes",
    description:
      "Take our intelligent AI-powered personality quiz. Analyze traits like extroversion, openness, agreeableness, and more using NLP and sentiment detection.",
    images: [
      // {
      //   url: "/static/images/personality-preview.png",
      //   width: 1200,
      //   height: 630,
      //   alt: "AI Personality Quiz Preview",
      // },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Wacky or Wise" }],
  alternates: {
    canonical: "https://www.wackyorwise.com/ai-personality-predictor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
