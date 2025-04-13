import type { Metadata } from "next";
import JsonFormatter from "./json-formatter.view";

export const metadata: Metadata = {
  title: "JSON Formatter - Essential Tool for Developers",
  description: "Format and validate JSON data with our easy-to-use tool. Perfect for developers, programmers, and tech enthusiasts working with JSON data.",
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
    "programming tools"
  ].join(", "),
  openGraph: {
    title: "JSON Formatter - Developer's Essential Tool",
    description: "Quickly format and validate JSON data with our powerful tool. Essential for developers and programmers.",
    type: "website",
  },
};

export default function JsonFormatterPage() {
  return <JsonFormatter />;
}