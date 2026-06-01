import Link from "next/link";
import type { MarketPostView } from "@/lib/market/market-data-types";

export function MarketEmptyState({ label }: { label: string }) {
  return <section className="market-section-panel"><p>{label}</p></section>;
}

export function MarketPostCard({ language = "en", marketPath, post }: { language?: string; marketPath: string; post: MarketPostView }) {
  const labels = postCardLabels(language);
  return (
    <Link className="market-section-card market-section-post-card" href={`${marketPath}/posts/${post.slug}/`}>
      {post.heroImage ? <img alt={post.heroImage.alt} src={post.heroImage.src} /> : null}
      <span>{post.articleMeta.readingTime || labels.guide}</span>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      <small>{post.seoReadinessScore}/100 {labels.readiness}</small>
    </Link>
  );
}

export function searchablePostText(post: MarketPostView): string {
  return [post.title, post.summary, ...post.keyTakeaways, ...post.sections.map((section) => `${section.heading} ${section.body}`)]
    .join(" ")
    .toLowerCase();
}

function postCardLabels(language: string) {
  if (language === "ko") return { guide: "가이드", readiness: "준비도" };
  if (language === "ja") return { guide: "ガイド", readiness: "準備度" };
  if (language === "es") return { guide: "Guía", readiness: "preparación" };
  if (language === "pt-br" || language === "pt") return { guide: "Guia", readiness: "preparo" };
  if (language === "fr") return { guide: "Guide", readiness: "préparation" };
  if (language === "de") return { guide: "Ratgeber", readiness: "Bereitschaft" };
  if (language === "it") return { guide: "Guida", readiness: "prontezza" };
  if (language === "nl") return { guide: "Gids", readiness: "gereedheid" };
  if (language === "pl") return { guide: "Poradnik", readiness: "gotowość" };
  if (language === "tr") return { guide: "Rehber", readiness: "hazırlık" };
  if (language === "id") return { guide: "Panduan", readiness: "kesiapan" };
  return { guide: "Guide", readiness: "readiness" };
}
