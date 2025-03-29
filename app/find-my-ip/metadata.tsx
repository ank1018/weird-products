// This file should be named 'find-my-ip-metadata.tsx' and placed alongside your page or route
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Find My IP Address | Detailed Browser, Network & Location Information',
  description: 'Discover your public IP address along with comprehensive details about your location, browser, and network connection. Learn about your country, region, city, and more to understand your online footprint and enhance your digital privacy.',
  keywords: 'IP address, find my IP, browser information, network details, online privacy, IP lookup, location, device info, internet security',
  openGraph: {
    title: 'Find My IP Address | Detailed Browser, Network & Location Information',
    description: 'Use our free tool to discover your public IP address and get in-depth details about your location, browser, and network connection.',
    images: [
      {
        url: '/static/images/ip-address-preview.png',
        width: 1200,
        height: 630,
        alt: 'IP Address Lookup Tool Preview',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find My IP Address | Detailed Browser, Network & Location Information',
    description: 'Use our free tool to discover your public IP address and get in-depth details about your location, browser, and network connection.',
    images: ['/static/images/ip-address-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: 'Your Website' }],
  alternates: {
    canonical: 'https://yourwebsite.com/find-my-ip',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};