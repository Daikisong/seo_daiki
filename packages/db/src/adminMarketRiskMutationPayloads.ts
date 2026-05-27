export interface MarketRiskMutationInput {
  id?: string;
  productId: string;
  locale: string;
  country?: string;
  plugRisk?: string;
  customsRisk?: string;
  certificationRisk?: string;
  returnRisk?: string;
  localAlternativeNote?: string;
  score?: number;
}

export function marketRiskMutationData(input: MarketRiskMutationInput) {
  return {
    productId: input.productId,
    locale: input.locale,
    country: input.country,
    plugRisk: input.plugRisk,
    customsRisk: input.customsRisk,
    certificationRisk: input.certificationRisk,
    returnRisk: input.returnRisk,
    localAlternativeNote: input.localAlternativeNote,
    score: input.score ?? 0.5
  };
}
