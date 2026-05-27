import { emptyEvidencePackJson } from "./admin-form-utils";

export function evidencePackJsonTextareaValue(packJson?: unknown) {
  return JSON.stringify(packJson ?? emptyEvidencePackJson(), null, 2);
}
