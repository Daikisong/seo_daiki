import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  images: {
    // TODO(pipeline): These official/review image hosts are temporary for the mock article.
    // Replace this with the merchant/affiliate-feed image CDN host list once product ingestion is wired.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.midea.com",
      },
      {
        protocol: "https",
        hostname: "us.ugreen.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.svg",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
