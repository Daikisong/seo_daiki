import type { EvidencePack, Locale } from "@global-import-lab/types";
import { jsonObject, type JsonValue } from "./contentRepositoryJson";

type Nullable<T> = T | null | undefined;

export type DbEvidencePackRow = {
  id: string;
  productId: Nullable<string>;
  locale: string;
  packJson: JsonValue;
  createdAt: Date;
};

export function mapDbEvidencePack(row: DbEvidencePackRow): EvidencePack {
  return {
    id: row.id,
    productId: row.productId ?? undefined,
    locale: row.locale as Locale,
    packJson: jsonObject(row.packJson) as EvidencePack["packJson"],
    createdAt: row.createdAt.toISOString().slice(0, 10)
  };
}
