import type { VerifiedClaim } from "@global-import-lab/types";

export function buildEssagerCableVerifiedClaims(updatedAt: string): VerifiedClaim[] {
  return [
    {
      id: "vc-essager-emarker",
      productId: "prod-essager-cable-100w",
      testType: "e_marker",
      resultValue: "Detected",
      method: "USB-C tester e-marker readout",
      evidenceUrl: "/en/data/usb-c-cable-100w-verification-table/",
      confidence: 0.75,
      testedAt: updatedAt
    }
  ];
}
