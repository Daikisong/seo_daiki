import type { getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import type { readLabEvidenceAssets } from "@/lib/admin/admin-section-data";

export type ProductRows = Awaited<ReturnType<typeof getAllProducts>>;
export type ProductRow = ProductRows[number];
export type EvidencePackRow = Awaited<ReturnType<typeof getAllEvidencePacks>>[number];
export type LabEvidenceRows = Awaited<ReturnType<typeof readLabEvidenceAssets>>;
