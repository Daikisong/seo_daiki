import type { VerifiedClaim } from "@global-import-lab/types";

export function buildUgreenVerifiedClaims(updatedAt: string): VerifiedClaim[] {
  return [
    {
      id: "vc-ugreen-output",
      productId: "prod-ugreen-100w",
      testType: "sustained_output",
      resultValue: "92",
      unit: "W for 20 minutes",
      method: "USB-C PD load test with e-marker cable",
      evidenceUrl: "/en/data/65w-gan-charger-output-table/",
      confidence: 0.78,
      testedAt: updatedAt
    }
  ];
}
