export function briefLocaleTypeLabel(brief: { articleType: string; locale: string }) {
  return `${brief.locale}/${brief.articleType}`;
}

export function previewList(items: string[], limit: number) {
  return items.slice(0, limit).join(", ");
}
