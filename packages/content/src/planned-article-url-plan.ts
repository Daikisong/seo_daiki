import type { UrlPlanRow } from "./article-draft-types";

export const initialUrlPlan: UrlPlanRow[] = [
  { locale: "en", type: "hub", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "data", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "lab", count: 5, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "guide", count: 15, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "compare", count: 10, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "review", count: 20, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" }
];

export const plannedUrlTotal = initialUrlPlan.reduce((total, row) => total + row.count, 0);
export const plannedIndexTargetTotal = initialUrlPlan.reduce((total, row) => total + row.indexTarget, 0);
