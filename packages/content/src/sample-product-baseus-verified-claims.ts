import type { VerifiedClaim } from "@global-import-lab/types";

export function buildBaseusVerifiedClaims(updatedAt: string): VerifiedClaim[] {
  return [
    {
      id: "vc-baseus-output",
      productId: "prod-baseus-65w",
      testType: "sustained_output",
      resultValue: "60",
      unit: "W for 20 minutes",
      method: "USB-C PD load test with thermal observation",
      evidenceUrl: "/en/lab/65w-gan-charger-real-output-test/",
      confidence: 0.84,
      testedAt: updatedAt
    },
    {
      id: "vc-baseus-temp",
      productId: "prod-baseus-65w",
      testType: "case_temperature",
      resultValue: "61",
      unit: "C",
      method: "Surface probe after 20 minute 60W load",
      evidenceUrl: "/en/lab/65w-gan-charger-real-output-test/",
      confidence: 0.8,
      testedAt: updatedAt
    },
    {
      id: "vc-baseus-pps-observed",
      productId: "prod-baseus-65w",
      testType: "pd_profile",
      resultValue: "PPS observed",
      method: "USB-C tester profile capture",
      evidenceUrl: "/en/data/65w-gan-charger-output-table/",
      confidence: 0.79,
      testedAt: updatedAt
    }
  ];
}
