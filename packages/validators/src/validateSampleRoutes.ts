import type { Article } from "@global-import-lab/types";
import {
  localizedGuideRouteFailures,
  localizedReviewRouteFailures,
  localizedSectionRouteFailures
} from "./validateSampleLocalizedRouteRules";
import { samplePlanFailures } from "./validateSamplePlanRules";
import { countryRiskRouteFailures } from "./validateSampleRiskRouteRules";

export function sampleRouteFailures({
  articles,
  indexableCount,
  plannedUrlTotal
}: {
  articles: Article[];
  indexableCount: number;
  plannedUrlTotal: number;
}) {
  return [
    ...samplePlanFailures(plannedUrlTotal, indexableCount),
    ...localizedReviewRouteFailures(articles),
    ...localizedGuideRouteFailures(articles),
    ...localizedSectionRouteFailures(articles),
    ...countryRiskRouteFailures(articles)
  ];
}

export { localizedSectionExpectations, requiredRiskPaths } from "./validateSampleRouteExpectations";
export {
  localizedGuideRouteFailures,
  localizedReviewRouteFailures,
  localizedSectionRouteFailures
} from "./validateSampleLocalizedRouteRules";
export { samplePlanFailures } from "./validateSamplePlanRules";
export { countryRiskRouteFailures } from "./validateSampleRiskRouteRules";
