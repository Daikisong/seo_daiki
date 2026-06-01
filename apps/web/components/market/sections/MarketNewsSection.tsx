import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { MarketPostView } from "@/lib/market/market-data-types";
import { newsListCopy } from "./market-section-copy";
import { MarketEmptyState } from "./MarketSectionShared";

export function MarketNewsList({
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
  const labels = newsListCopy(language);
  const rows = posts
    .map((post) => ({
      href: `${marketPath}/posts/${post.slug}/`,
      title: post.title,
      body: post.summary,
      date: post.articleMeta.checkedAt,
      readingTime: post.articleMeta.readingTime,
      sourceCount: post.sourceLinks.length,
      meta: labels.newsArticle
    }))
    .slice(0, 8);
  if (rows.length === 0) return <MarketEmptyState label={emptyLabel} />;
  return (
    <section className="market-news-feed">
      <div className="market-news-feed-head">
        <div>
          <span>{labels.feedEyebrow}</span>
          <h2>{labels.feedTitle}</h2>
        </div>
        <small>{labels.articleCount(rows.length)}</small>
      </div>
      <div className="market-news-list">
        {rows.map((row) => (
          <Link className="market-news-item" href={row.href} key={`${row.href}-${row.title}`}>
            <span className="market-news-icon"><Newspaper aria-hidden /></span>
            <span className="market-news-copy">
              <small>{row.meta}</small>
              <strong>{row.title}</strong>
              <em>{row.body}</em>
              <span className="market-news-meta">
                {row.date ? <time dateTime={row.date}>{row.date}</time> : null}
                {row.readingTime ? <b>{row.readingTime}</b> : null}
                <b>{labels.sourceCount(row.sourceCount)}</b>
              </span>
            </span>
            <span className="market-news-action">{labels.readAction}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
