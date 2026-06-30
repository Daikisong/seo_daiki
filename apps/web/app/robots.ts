import type { MetadataRoute } from "next";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [await requestAbsoluteUrl("/sitemap.xml")],
  };
}
