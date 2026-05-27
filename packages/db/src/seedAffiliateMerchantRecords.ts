import {
  defaultAliExpressAllowedDomains,
  defaultIherbAllowedDomains,
  domainListFromEnv
} from "./seedAffiliateModel";
import type { SeedDbClient } from "./seedTypes";
import { toSeedJson } from "./seedTypes";

export type SeedAffiliateMerchants = Awaited<ReturnType<typeof seedAffiliateMerchants>>;

export function seedAffiliateMerchantCreateData(env: NodeJS.ProcessEnv = process.env) {
  return {
    aliexpress: {
      id: "merchant-aliexpress",
      name: "AliExpress",
      slug: "aliexpress",
      domain: "aliexpress.com",
      merchantType: "marketplace",
      allowedDomains: toSeedJson(domainListFromEnv("ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS", defaultAliExpressAllowedDomains, env)),
      healthSensitive: false
    },
    iherb: {
      id: "merchant-iherb",
      name: "iHerb",
      slug: "iherb",
      domain: "iherb.com",
      merchantType: "supplement_store",
      allowedDomains: toSeedJson(domainListFromEnv("IHERB_ALLOWED_AFFILIATE_DOMAINS", defaultIherbAllowedDomains, env)),
      healthSensitive: true
    }
  };
}

export function seedAffiliateProgramCreateData(
  merchants: { aliexpress: { id: string }; iherb: { id: string } },
  env: NodeJS.ProcessEnv = process.env
) {
  return {
    aliexpressProgram: {
      id: "program-aliexpress-default",
      merchantId: merchants.aliexpress.id,
      network: env.ALIEXPRESS_AFFILIATE_NETWORK ?? "inhouse",
      trackingId: env.ALIEXPRESS_TRACKING_ID,
      termsNote: "Seeded default program for AliExpress marketplace offers."
    },
    iherbProgram: {
      id: "program-iherb-default",
      merchantId: merchants.iherb.id,
      network: env.IHERB_AFFILIATE_NETWORK ?? "inhouse",
      trackingId: env.IHERB_TRACKING_ID,
      termsNote: "Seeded default program for iHerb supplement-store offers; health pages still require compliance review."
    }
  };
}

export async function seedAffiliateMerchants(db: SeedDbClient) {
  const merchantData = seedAffiliateMerchantCreateData();
  const aliexpress = await db.merchant.create({ data: merchantData.aliexpress });
  const iherb = await db.merchant.create({ data: merchantData.iherb });
  const programData = seedAffiliateProgramCreateData({ aliexpress, iherb });
  const aliexpressProgram = await db.affiliateProgram.create({ data: programData.aliexpressProgram });
  const iherbProgram = await db.affiliateProgram.create({ data: programData.iherbProgram });

  return {
    aliexpress,
    aliexpressProgram,
    iherb,
    iherbProgram
  };
}
