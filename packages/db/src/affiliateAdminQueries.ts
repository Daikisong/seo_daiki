import { prisma } from "./client";

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
