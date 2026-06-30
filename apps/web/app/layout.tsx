import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import { getSiteUrl } from "@/lib/trend-site/routes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TREND - Jacob",
    template: "%s | TREND - Jacob"
  },
  description:
    "Trend-led buyer guides across AliExpress, Temu, Amazon, iHerb, and other marketplaces, built from specs, price, seller terms, and review complaints.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  }
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
