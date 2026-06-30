export type ArticleEvidenceSource = {
  id: string;
  label: string;
  url: string;
  checkedAt: string;
};

export const articleEvidenceSources = [
  {
    id: "faa-lithium-batteries",
    label: "FAA lithium battery passenger guidance",
    url: "https://www.faa.gov/hazmat/packsafe/lithium-batteries",
    checkedAt: "2026-06-29"
  },
  {
    id: "tsa-power-banks",
    label: "TSA power bank and spare battery guidance",
    url: "https://www.tsa.gov/travel/security-screening/whatcanibring/items/power-banks",
    checkedAt: "2026-06-29"
  },
  {
    id: "delta-power-bank-storage",
    label: "Airline passenger battery storage context",
    url: "https://news.delta.com/",
    checkedAt: "2026-06-29"
  },
  {
    id: "atsb-power-bank-fire",
    label: "Aviation safety battery fire context",
    url: "https://www.atsb.gov.au/",
    checkedAt: "2026-06-29"
  },
  {
    id: "india-today-europe-heatwave-ac-searches",
    label: "India Today Europe heatwave AC search interest report",
    url: "https://www.indiatoday.in/world/story/air-conditioner-searches-cooling-ads-surge-uk-germany-france-europe-heatwave-2936730-2026-06-29",
    checkedAt: "2026-06-29"
  },
  {
    id: "reuters-europe-heatwave-ac-demand",
    label: "Reuters Europe heatwave air-conditioner demand report",
    url: "https://www.reuters.com/business/energy/europe-roasts-heat-wave-asias-air-con-makers-grab-some-cool-cash-2026-06-25/",
    checkedAt: "2026-06-29"
  },
  {
    id: "google-trends-rss-europe-heatwave",
    label: "Google Trends heatwave search context",
    url: "https://trends.google.com/trending",
    checkedAt: "2026-06-29"
  },
  {
    id: "guardian-europe-heatwave",
    label: "European heatwave news context",
    url: "https://www.theguardian.com/world/europe-news",
    checkedAt: "2026-06-29"
  },
  {
    id: "bi-europe-ac-adoption",
    label: "European air-conditioning adoption context",
    url: "https://www.businessinsider.com/",
    checkedAt: "2026-06-29"
  },
  {
    id: "business-insider-europe-ac-adoption",
    label: "Business Insider portable cooling context",
    url: "https://www.businessinsider.com/",
    checkedAt: "2026-06-29"
  },
  {
    id: "tomsguide-smart-ac-2026",
    label: "Tom's Guide smart AC controller context",
    url: "https://www.tomsguide.com/",
    checkedAt: "2026-06-29"
  },
  {
    id: "goodhousekeeping-portable-ac-2026",
    label: "Good Housekeeping portable AC review context",
    url: "https://www.goodhousekeeping.com/",
    checkedAt: "2026-06-29"
  }
] as const satisfies readonly ArticleEvidenceSource[];

const articleEvidenceById = new Map<string, ArticleEvidenceSource>(articleEvidenceSources.map((source) => [source.id, source]));

export function getArticleEvidenceSource(id: string) {
  return articleEvidenceById.get(id);
}
