import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  title: {
    default: "Global Import Lab",
    template: "%s | Global Import Lab"
  },
  description: "A multilingual product evidence database for imported ecommerce products."
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
