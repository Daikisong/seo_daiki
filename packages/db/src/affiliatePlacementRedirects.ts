import { affiliateClickInputFromPlacement, affiliateRedirectBlocker } from "./affiliateRedirectRules";
import { prisma } from "./client";
import { AffiliateRedirectError } from "./affiliateClickTypes";
import { recordAffiliateClick } from "./affiliateClickTracking";

export async function resolveAffiliatePlacementRedirect(input: {
  placementId: string;
  referrer?: string;
  utm?: Record<string, string>;
}) {
  const placement = await prisma.affiliatePlacement.findUnique({
    where: { id: input.placementId },
    include: {
      article: { select: { id: true, locale: true, productId: true } },
      offer: { include: { merchant: true } }
    }
  });

  if (!placement) {
    throw new AffiliateRedirectError("Affiliate placement was not found.", 404);
  }

  const blocker = affiliateRedirectBlocker(placement);
  if (blocker) {
    throw new AffiliateRedirectError(blocker.message, blocker.status);
  }

  const clickInput = affiliateClickInputFromPlacement(placement, input);
  await recordAffiliateClick(clickInput);

  return {
    targetUrl: placement.offer.affiliateUrl,
    placementId: placement.id,
    offerId: placement.offer.id,
    merchantId: placement.offer.merchant.id
  };
}
