import { NextRequest, NextResponse } from "next/server";

const allowedAffiliateHosts = [
  "aliexpress.com",
  "www.aliexpress.com",
  "temu.com",
  "www.temu.com",
  "amazon.com",
  "www.amazon.com",
  "iherb.com",
  "www.iherb.com"
];

export function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("target");
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing target URL" }, { status: 400 });
  }

  // TODO(pipeline): Keep this strict allowlist, but feed it validated affiliate deep links instead of mock search URLs.
  // If the rendered button points to a placeholder, the redirect may work technically while still being a bad user link.
  const parsed = safeMarketplaceUrl(targetUrl);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid marketplace URL" }, { status: 400 });
  }

  return NextResponse.redirect(parsed, 302);
}

function safeMarketplaceUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return undefined;
    }
    const hostname = url.hostname.toLowerCase();
    if (!allowedAffiliateHosts.includes(hostname)) {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}
