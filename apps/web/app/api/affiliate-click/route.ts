import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("target");
  if (!targetUrl || !isSafeHttpUrl(targetUrl)) {
    return NextResponse.json({ error: "Invalid target URL" }, { status: 400 });
  }

  if (process.env.CONTENT_SOURCE === "database") {
    try {
      const { recordAffiliateClick } = await import("@global-import-lab/db/affiliate-clicks");
      await recordAffiliateClick({
        articleId: request.nextUrl.searchParams.get("articleId") ?? undefined,
        productId: request.nextUrl.searchParams.get("productId") ?? undefined,
        variantId: request.nextUrl.searchParams.get("variantId") ?? undefined,
        locale: request.nextUrl.searchParams.get("locale") ?? undefined,
        targetUrl,
        referrer: request.headers.get("referer") ?? undefined,
        utm: collectUtm(request)
      });
    } catch (error) {
      console.warn("Affiliate click tracking failed; redirecting without blocking the visitor.", error);
    }
  }

  return NextResponse.redirect(targetUrl, 302);
}

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function collectUtm(request: NextRequest) {
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) {
      utm[key] = value;
    }
  }
  return utm;
}
