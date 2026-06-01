import Link from "next/link";
import { estimatedProductPostViews } from "@/lib/market/market-content-branches";
import type { MarketPostView } from "@/lib/market/market-data-types";
import { reviewHomeCopy } from "./market-section-copy";
import { MarketEmptyState, MarketPostCard } from "./MarketSectionShared";

export function ProductReviewHome({
  emptyLabel,
  language,
  marketPath,
  posts
}: {
  emptyLabel: string;
  language: string;
  marketPath: string;
  posts: MarketPostView[];
}) {
  if (posts.length === 0) return <MarketEmptyState label={emptyLabel} />;
  const [featured, ...rest] = posts;
  const labels = reviewHomeCopy(language);
  return (
    <>
      <section className="market-review-lead">
        <Link className="market-review-featured" href={`${marketPath}/posts/${featured.slug}/`}>
          {featured.heroImage ? <img alt={featured.heroImage.alt} src={featured.heroImage.src} /> : null}
          <div>
            <span>{labels.featured}</span>
            <h2>{featured.title}</h2>
            <p>{featured.summary}</p>
            <small>{featured.articleMeta.readingTime || labels.guide} · {featured.seoReadinessScore}/100</small>
          </div>
        </Link>
      </section>
      {rest.length > 0 ? (
        <section className="market-review-list">
          <div className="market-review-section-heading">
            <span>{labels.listEyebrow}</span>
            <h2>{labels.listTitle}</h2>
          </div>
          <div className="market-section-grid">
            {rest.map((post) => (
              <MarketPostCard key={post.id} language={language} marketPath={marketPath} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export function ProductRankingList({
  emptyLabel,
  language,
  marketPath,
  posts
}: {
  emptyLabel: string;
  language: string;
  marketPath: string;
  posts: MarketPostView[];
}) {
  if (posts.length === 0) return <MarketEmptyState label={emptyLabel} />;
  const viewsLabel = rankingViewsLabel(language);
  return (
    <section className="market-ranking-list">
      {posts.map((post, index) => (
        <Link href={`${marketPath}/posts/${post.slug}/`} key={post.id}>
          <strong>{index + 1}</strong>
          <span>
            <b>{post.title}</b>
            <em>{post.summary}</em>
          </span>
          <small>{estimatedProductPostViews(post).toLocaleString()} {viewsLabel}</small>
        </Link>
      ))}
    </section>
  );
}

function rankingViewsLabel(language: string) {
  if (language === "ko") return "조회";
  if (language === "ja") return "閲覧";
  if (language === "es") return "vistas";
  if (language === "pt-br" || language === "pt") return "visualizações";
  if (language === "fr") return "vues";
  if (language === "de") return "Aufrufe";
  if (language === "it") return "visualizzazioni";
  if (language === "nl") return "weergaven";
  if (language === "pl") return "wyświetleń";
  if (language === "tr") return "görüntülenme";
  if (language === "id") return "tayangan";
  return "views";
}
