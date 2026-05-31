import labelsJson from "../../../../data/config/ui-labels.json";

export type UiLabelKey = keyof (typeof labelsJson)["en"];
export type UiLabels = Record<UiLabelKey, string>;

const englishLabels = labelsJson.en as UiLabels;

export function labelsForLanguage(language: string) {
  const labels = (labelsJson as Record<string, Partial<UiLabels>>)[language];
  const missingKeys = Object.keys(englishLabels).filter((key) => !labels?.[key as UiLabelKey]) as UiLabelKey[];
  return {
    labels: { ...englishLabels, ...(labels ?? {}) } as UiLabels,
    complete: Boolean(labels) && missingKeys.length === 0,
    missingKeys
  };
}

export function supportedUiLabelLanguages() {
  return Object.keys(labelsJson);
}
