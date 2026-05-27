import { prisma } from "./client";
import type { Prisma } from "./generated/prisma/client";
import {
  affiliateClickInputFromPlacement,
  affiliatePlacementApprovalBlocker,
  affiliateRedirectBlocker
} from "./affiliateRedirectRules";

export interface AffiliateClickInput {
  articleId?: string;
  placementId?: string;
  offerId?: string;
  merchantId?: string;
  productId?: string;
  variantId?: string;
  locale?: string;
  targetUrl: string;
  referrer?: string;
  utm?: Record<string, string>;
}

export async function recordAffiliateClick(input: AffiliateClickInput) {
  return prisma.affiliateClick.create({
    data: {
      articleId: input.articleId,
      placementId: input.placementId,
      offerId: input.offerId,
      merchantId: input.merchantId,
      productId: input.productId,
      variantId: input.variantId,
      locale: input.locale,
      targetUrl: input.targetUrl,
      referrer: input.referrer,
      utm: input.utm ?? {}
    }
  });
}

export class AffiliateRedirectError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AffiliateRedirectError";
    this.status = status;
  }
}

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

export async function listAffiliateMerchants() {
  return prisma.merchant.findMany({
    orderBy: { slug: "asc" },
    include: {
      _count: { select: { programs: true, offers: true, affiliateClicks: true } }
    }
  });
}

export async function listAffiliateOffers() {
  return prisma.offer.findMany({
    orderBy: [{ merchant: { slug: "asc" } }, { locale: "asc" }, { title: "asc" }],
    include: { merchant: true, _count: { select: { affiliatePlacements: true, affiliateClicks: true } } }
  });
}

export async function listAffiliatePlacements() {
  return prisma.affiliatePlacement.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      article: { select: { id: true, locale: true, slug: true, type: true, title: true } },
      offer: { include: { merchant: true } },
      _count: { select: { affiliateClicks: true } }
    }
  });
}

export const affiliatePlacementStatuses = ["draft", "approved", "rejected", "disabled"] as const;
export type AffiliatePlacementStatus = (typeof affiliatePlacementStatuses)[number];

export async function updateAffiliatePlacementStatus(input: {
  id: string;
  status: AffiliatePlacementStatus;
  disclosureShown?: boolean;
  actor?: string;
}) {
  const before = await prisma.affiliatePlacement.findUnique({
    where: { id: input.id },
    include: { offer: { include: { merchant: true } } }
  });
  if (!before) {
    throw new AffiliateRedirectError("Affiliate placement was not found.", 404);
  }

  const nextDisclosureShown = input.disclosureShown ?? before.disclosureShown;
  if (input.status === "approved") {
    const blocker = affiliatePlacementApprovalBlocker(before, nextDisclosureShown);
    if (blocker) {
      throw new AffiliateRedirectError(blocker.message, blocker.status);
    }
  }

  return prisma.$transaction(async (tx) => {
    const after = await tx.affiliatePlacement.update({
      where: { id: input.id },
      data: {
        status: input.status,
        disclosureShown: nextDisclosureShown
      },
      include: {
        article: { select: { id: true, locale: true, slug: true, type: true, title: true } },
        offer: { include: { merchant: true } },
        _count: { select: { affiliateClicks: true } }
      }
    });

    await tx.auditLog.create({
      data: {
        entityType: "affiliate-placement",
        entityId: after.id,
        action: "update_status",
        actor: input.actor ?? "admin",
        summary: `Updated affiliate placement status to ${input.status}.`,
        beforeJson: toJson(before),
        afterJson: toJson({
          id: after.id,
          status: after.status,
          disclosureShown: after.disclosureShown
        })
      }
    });

    return after;
  });
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
