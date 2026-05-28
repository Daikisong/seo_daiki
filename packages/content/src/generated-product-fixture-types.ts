export interface GeneratedProductSpec {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim: string;
  claimType: string;
  claimValue: string;
  verifiedTestType: string;
  verifiedResult: string;
  verifiedUnit?: string;
  optionName: string;
  trapOptionName: string;
  wattageClaim?: number;
  trapWattageClaim?: number;
  plugType?: string;
  sourceSlug: string;
  price: number;
  shipping: number;
  sellerName: string;
  riskTopic: string;
}
