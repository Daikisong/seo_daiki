import type { Article, EvidencePack, Product } from "@global-import-lab/types";

export interface ComplianceGateResult {
  issues: Array<{ code: string }>;
}

export interface BuildSampleComplianceRowsInput {
  sampleArticles: Article[];
  products: Product[];
  evidencePacks: EvidencePack[];
  evaluateQualityGate: (input: { article: Article; product?: Product; evidencePack?: EvidencePack }) => ComplianceGateResult;
  limit?: number;
}
