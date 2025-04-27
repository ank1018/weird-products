import "./globals.css";
import { Sigmar } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google'
import LayoutContent from './layout-content';
import { metadata } from './metadata';

const sigmar = Sigmar({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sigmar",
});

export { metadata };

// Event tracking function
declare global {
  interface Window {
    mongoose: { conn: null; promise: null };
    gtag: (command: 'config' | 'event' | 'js', ...args: unknown[]) => void;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ER3W9VVXM5"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ER3W9VVXM5', {
                page_path: window.location.pathname,
              });
              
              // Enhanced event tracking
              document.addEventListener('click', function(e) {
                const target = e.target;
                
                // Track tool usage
                if (target instanceof Element && target.closest('[data-tool]')) {
                  const tool = target.closest('[data-tool]')?.getAttribute('data-tool');
                  gtag('event', 'tool_usage', {
                    'event_category': 'Tools',
                    'event_label': tool,
                    'value': 1
                  });
                }
                
                // Track button clicks
                if (target instanceof Element && target.closest('button')) {
                  const buttonText = target.closest('button')?.textContent?.trim();
                  gtag('event', 'button_click', {
                    'event_category': 'Interaction',
                    'event_label': buttonText,
                    'value': 1
                  });
                }
                
                // Track external links
                if (target instanceof Element && target.closest('a[href^="http"]')) {
                  const link = target.closest('a')?.getAttribute('href');
                  gtag('event', 'external_link_click', {
                    'event_category': 'Navigation',
                    'event_label': link,
                    'value': 1
                  });
                }
              });
              
              // Track page views with custom dimensions
              gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname
              });
            `,
          }}
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Wacky or Wise",
              url: "https://www.wackyorwise.com",
              description:
                "Explore bizarre, viral, and surprisingly useful products. Vote on whether they are genius or just plain weird!",
              publisher: {
                "@type": "Organization",
                name: "WackyOrWise",
                logo: "https://www.wackyorwise.com/images/logo.png",
              },
            }),
          }}
        />
        <meta
          name="google-adsense-account"
          content={"ca-pub-2405880474323539"}
        />
        <Script
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2405880474323539`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={sigmar.variable}>
        <LayoutContent>
          {children}
        </LayoutContent>
        <GoogleAnalytics gaId="G-ER3W9VVXM5" />
      </body>
    </html>
  );
}
