import { isRecord, stringArrayFromUnknown, stringFromUnknown } from "./admin-value-utils";

export function complianceIssuesFromJson(value: unknown) {
  if (!isRecord(value)) {
    return [];
  }
  const issues = value.issues ?? value.blockers ?? value.healthBlockers ?? value.localizationBlockers;
  return stringArrayFromUnknown(issues);
}

export function outlineHeadings(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (typeof item === "string") {
      return item.trim() ? [item.trim()] : [];
    }
    if (!isRecord(item)) {
      return [];
    }
    const heading = stringFromUnknown(item.heading);
    return heading ? [heading] : [];
  });
}
