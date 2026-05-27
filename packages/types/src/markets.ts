export type MarketCode =
  | "us"
  | "gb"
  | "ca"
  | "au"
  | "es"
  | "mx"
  | "br"
  | "pt"
  | "fr"
  | "de"
  | "it"
  | "nl"
  | "pl"
  | "tr"
  | "id"
  | "jp"
  | "kr"
  | "in";

export interface MarketConfig {
  market: MarketCode;
  language: string;
  country: string;
  currency: string;
  timezone: string;
  trendsGeo: string;
  serpGl: string;
  serpHl: string;
  pathPrefix: string;
  enabled: boolean;
  monetizationReadiness: "research_only" | "candidate_analysis" | "review_ready" | "approved";
  defaultCategories: string[];
  blockedCategories: string[];
  searchConsoleCountryFilter: string;
  serpLocaleConfig: { gl: string; hl: string };
  localizationRules: string[];
  trendFeedPath: string;
  editorialCalendarPath: string;
}
