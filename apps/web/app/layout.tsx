import type { Metadata } from "next";
import { getSiteUrl } from "@global-import-lab/seo";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Global Import Lab",
    template: "%s | Global Import Lab"
  },
  description: "A global trend-to-content research and publishing system with market-specific SEO silos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
