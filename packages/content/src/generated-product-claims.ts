import type { SellerClaim, VerifiedClaim } from "@global-import-lab/types";
import { generatedProductBuildContext, type GeneratedProductBuildContext } from "./generated-product-fixture-context";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export function buildGeneratedSellerClaims(
  spec: GeneratedProductSpec,
  updatedAt: string,
  context: GeneratedProductBuildContext = generatedProductBuildContext(spec)
): SellerClaim[] {
  return [
    {
      id: `sc-${spec.sourceSlug}-primary`,
      productId: spec.id,
      claimType: spec.claimType,
      claimValue: spec.claimValue,
      rawText: `${spec.canonicalName} ${spec.claimValue}`,
      sourceUrl: context.sourceUrl,
      capturedAt: updatedAt,
      confidence: 0.68
    },
    {
      id: `sc-${spec.sourceSlug}-bundle`,
      productId: spec.id,
      claimType: "variant_scope",
      claimValue: spec.trapOptionName,
      rawText: `Options include ${spec.optionName} and ${spec.trapOptionName}`,
      sourceUrl: context.sourceUrl,
      capturedAt: updatedAt,
      confidence: 0.7
    }
  ];
}

export function buildGeneratedVerifiedClaims(spec: GeneratedProductSpec, updatedAt: string): VerifiedClaim[] {
  return [
    {
      id: `vc-${spec.sourceSlug}-primary`,
      productId: spec.id,
      testType: spec.verifiedTestType,
      resultValue: spec.verifiedResult,
      unit: spec.verifiedUnit,
      method: "Bench check recorded in the sample evidence ledger",
      evidenceUrl: "/en/data/65w-gan-charger-output-table/",
      confidence: 0.73,
      testedAt: updatedAt
    }
  ];
}
