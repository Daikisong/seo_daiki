import type { Prisma } from "./generated/prisma/client";
import { affiliatePlacementApprovalBlocker } from "./affiliateRedirectRules";
import { prisma } from "./client";
import {
  AffiliateRedirectError,
  type AffiliatePlacementStatus,
  affiliatePlacementStatuses
} from "./affiliateClickTypes";

export { affiliatePlacementStatuses, type AffiliatePlacementStatus };

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
