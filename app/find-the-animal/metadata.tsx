import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Find the Invisible Animal | Jungle Sound Game for Kids & Grown-Ups",
  description:
    "Play an immersive jungle game where you find invisible animals using sound clues! Perfect for kids and adults. Play with doodles, sounds, and confetti!",
  keywords:
    "jungle game, find the animal, kids game, sound game, doodle animal game, jungle adventure, mobile game, family fun, AI sound game, fun guessing game",
  openGraph: {
    title: "Find the Invisible Animal | Jungle Sound Game for Kids & Grown-Ups",
    description:
      "Guess the animal's location by following sound cues. Play a fun doodle-filled guessing game with audio feedback and confetti rewards!",
    images: [
    //   {
    //     url: "/static/images/find-the-animal-preview.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Find the Invisible Animal - Game Preview",
    //   },
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
    canonical: "https://www.wackyorwise.com/find-the-animal",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
