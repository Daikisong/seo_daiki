import { NextRequest, NextResponse } from "next/server";
import { isAffiliateRedirectError } from "./affiliate-click-errors";
import {
  collectUtmFromSearchParams,
  optionalSearchParam,
  referrerFromHeaders
} from "./affiliate-click-request";
import { isSafeHttpUrl, isUnsafeTargetRedirectAllowed } from "./affiliate-click-target-rules";

export async function GET(request: NextRequest) {
  const placementId = request.nextUrl.searchParams.get("placementId");
  const searchParams = request.nextUrl.searchParams;
  const referrer = referrerFromHeaders(request.headers);
  const utm = collectUtmFromSearchParams(searchParams);

  if (placementId) {
    try {
      const { resolveAffiliatePlacementRedirect } = await import("@global-import-lab/db/affiliate-clicks");
      const redirect = await resolveAffiliatePlacementRedirect({
        placementId,
        referrer,
        utm
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
        articleId: optionalSearchParam(searchParams, "articleId"),
        productId: optionalSearchParam(searchParams, "productId"),
        variantId: optionalSearchParam(searchParams, "variantId"),
        locale: optionalSearchParam(searchParams, "locale"),
        targetUrl,
        referrer,
        utm
      });
    } catch (error) {
      console.warn("Affiliate click tracking failed; redirecting without blocking the visitor.", error);
    }
  }

  return NextResponse.redirect(targetUrl, 302);
}
