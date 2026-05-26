import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: [`${siteUrl.replace(/\/$/, "")}/sitemap.xml`, `${siteUrl.replace(/\/$/, "")}/sitemaps/index.xml`]
  };
}
