import type { Article, EvidencePack, IndexStatus, Product } from "@global-import-lab/types";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: "blocker" | "warning";
}

export interface QualityGateResult {
  score: number;
  indexStatus: IndexStatus;
  issues: ValidationIssue[];
  breakdown: Record<string, number>;
}

export interface QualityGateInput {
  article: Article;
  product?: Product;
  evidencePack?: EvidencePack;
}
