export function trendLocaleLabel(trend: { country?: string | null; locale: string }) {
  return `${trend.locale}${trend.country ? `/${trend.country}` : ""}`;
}

export function trendScoreLabel(trend: {
  affiliateFitScore: number;
  commercialScore: number;
  evidenceFitScore: number;
  growthScore: number;
}) {
  return `growth ${trend.growthScore}, commercial ${trend.commercialScore}, evidence ${trend.evidenceFitScore}, affiliate ${trend.affiliateFitScore}`;
}
