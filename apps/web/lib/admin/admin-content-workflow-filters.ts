import { stringFromSearchParam } from "./admin-section-utils";
import type { AdminSearchParams } from "./admin-content-workflow-types";

export function contentWorkflowTrendFilters(filters: AdminSearchParams) {
  return {
    locale: stringFromSearchParam(filters.locale),
    country: stringFromSearchParam(filters.country),
    source: stringFromSearchParam(filters.source)
  };
}
