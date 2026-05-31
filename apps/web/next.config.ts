import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  transpilePackages: [
    "@global-import-lab/content",
    "@global-import-lab/db",
    "@global-import-lab/seo",
    "@global-import-lab/types",
    "@global-import-lab/validators"
  ]
};

export default nextConfig;
