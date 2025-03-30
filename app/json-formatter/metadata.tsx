import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | Beautify & Validate JSON Online",
  description:
    "Use our free online JSON Formatter and Validator to format, beautify, and validate your JSON data effortlessly. Supports indentation, error detection, and easy readability.",
  keywords:
    "JSON formatter, JSON beautifier, JSON validator, format JSON, beautify JSON, JSON lint, online JSON tool, JSON pretty print",
  openGraph: {
    title: "JSON Formatter & Validator | Beautify & Validate JSON Online",
    description:
      "Easily format, beautify, and validate JSON data with our free online JSON tool. Get error-free, well-structured JSON instantly.",
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
  authors: [{ name: "Your Website" }],
  alternates: {
    canonical: "https://www.wackyorwise.com/json-formatter",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
