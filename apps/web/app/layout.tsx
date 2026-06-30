import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import {
  trendSiteDescription,
  trendSiteName,
} from "@/lib/trend-site/categories";
import { getSiteUrl } from "@/lib/trend-site/routes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: trendSiteName,
    template: `%s | ${trendSiteName}`,
  },
  description: trendSiteDescription,
  icons: {
    icon: [
      { url: "/brand/trendbrief-icon.svg", type: "image/svg+xml" },
      { url: "/brand/trendbrief-icon-192.png", sizes: "192x192" },
    ],
    apple: [{ url: "/brand/trendbrief-icon-192.png", sizes: "192x192" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
