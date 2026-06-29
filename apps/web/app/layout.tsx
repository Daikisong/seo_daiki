import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteUrl } from "@global-import-lab/seo";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import "./globals.css";
import "./styles/market-shell-and-sections.css";
import "./styles/market-article-detail.css";
import "./styles/market-public-overrides.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Trend Picks - Jacob",
    template: "%s | Trend Picks - Jacob"
  },
  description: "Trend Picks - Jacob.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const htmlLang = htmlLanguage(requestHeaders.get("x-market-language"));
  return (
    <html lang={htmlLang}>
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

function htmlLanguage(language: string | null): string {
  const supported = new Set(["en", "es", "pt-br", "pt", "fr", "de", "it", "nl", "pl", "tr", "id", "ja", "ko"]);
  return language && supported.has(language) ? language : "en";
}
