export type Article = {
  market?: string;
  language?: string;
  slug?: string;
  title?: string;
  summary?: string;
  sections?: Array<{ heading?: string; body?: string }>;
  heroImage?: { src?: string; alt?: string; caption?: string };
  articleMeta?: { checkedAt?: string; readingTime?: string; reviewer?: string; basis?: string };
  keyTakeaways?: unknown[];
  verdictBox?: { label?: string; body?: string };
  prosCons?: { pros?: unknown[]; cons?: unknown[] };
  serpReferences?: Array<{ rank?: string; label?: string; url?: string; formatPattern?: string }>;
  quickFacts?: unknown[];
  checklist?: unknown[];
  comparisonTable?: { columns?: unknown[]; rows?: unknown[] };
  sourceLinks?: Array<{ label?: string; url?: string; note?: string; checkedAt?: string }>;
  internalLinks?: Array<{ label?: string; href?: string; note?: string }>;
  seoReadinessScore?: number;
  affiliateLinks?: unknown[];
  monetizationDeferred?: boolean;
  indexStatus?: string;
  contentBranch?: "review" | "news";
};

export type AuditCheck = {
  name: string;
  pass: boolean;
};

export type WeightedAuditCheck = AuditCheck & {
  points: number;
};
