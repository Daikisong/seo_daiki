import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const placementId = request.nextUrl.searchParams.get("placementId");
  if (placementId) {
    try {
      const { resolveAffiliatePlacementRedirect } = await import("@global-import-lab/db/affiliate-clicks");
      const redirect = await resolveAffiliatePlacementRedirect({
        placementId,
        referrer: request.headers.get("referer") ?? undefined,
        utm: collectUtm(request)
      });

      return NextResponse.redirect(redirect.targetUrl, 302);
    } catch (error) {
      if (isAffiliateRedirectError(error)) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      console.error("Affiliate placement redirect failed.", error);
      return NextResponse.json({ error: "Affiliate redirect failed. Check database connectivity." }, { status: 503 });
    }
  }

  const targetUrl = request.nextUrl.searchParams.get("target");
  if (!isUnsafeTargetRedirectAllowed()) {
    return NextResponse.json({ error: "Affiliate placementId is required." }, { status: 400 });
  }

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

function isUnsafeTargetRedirectAllowed() {
  return process.env.NODE_ENV !== "production" && process.env.ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT === "true";
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

function isAffiliateRedirectError(error: unknown): error is { name: string; message: string; status: number } {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "name" in error &&
    error.name === "AffiliateRedirectError" &&
    "message" in error &&
    typeof error.message === "string" &&
    "status" in error &&
    typeof error.status === "number"
  );
}
