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
      <body>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
