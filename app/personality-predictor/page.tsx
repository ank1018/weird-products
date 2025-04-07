import { pageMetadata } from "../metadata";
import PersonalityPredictor from "./personality-predictor.view";

export const metadata = {
  ...pageMetadata.personalityPredictor,
  openGraph: {
    title: pageMetadata.personalityPredictor.title,
    description: pageMetadata.personalityPredictor.description,
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
    canonical: pageMetadata.personalityPredictor.canonical,
  },
};

export default function PersonalityPredictorPage() {
  return <PersonalityPredictor />;
}