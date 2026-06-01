import type { MarketPostView } from "@/lib/market/market-data-types";

export interface NewsDetailSection {
  body: string;
  heading: string;
  id: string;
  number: number;
}

export function buildNewsSections(post: MarketPostView, sectionLabel: string): NewsDetailSection[] {
  return post.sections.map((section, index) => ({
    ...section,
    id: anchorId(section.heading || `${sectionLabel} ${index + 1}`),
    number: index + 1
  }));
}

export function buildNewsKeyPoints(post: MarketPostView, sections: Array<Pick<NewsDetailSection, "body">>): string[] {
  return (post.keyTakeaways.length > 0 ? post.keyTakeaways : sections.map((section) => section.body)).slice(0, 3);
}

export function anchorId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-")
    .replace(/^-|-$/g, "");
}

export function paragraphs(value: string): string[] {
  return value.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
}
