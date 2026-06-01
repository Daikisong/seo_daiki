import Link from "next/link";
import { Bell, Search, Trophy, Users, Wrench } from "lucide-react";
import { MarketSubscribeForm } from "@/components/market/MarketSubscribeForm";
import type { MarketPostView, MarketTrendView } from "@/lib/market/market-data-types";
import { communityCopy, searchCopy, subscribeBody, subscribeHeading, tipsCopy } from "./market-section-copy";
import { searchablePostText } from "./MarketSectionShared";

export function TipsSection({ language }: { language: string }) {
  const tips = tipsCopy(language);
  return (
    <section className="market-section-grid">
      {tips.map((tip) => (
        <article className="market-section-card" key={tip.title}>
          <Wrench aria-hidden />
          <h2>{tip.title}</h2>
          <p>{tip.body}</p>
        </article>
      ))}
    </section>
  );
}

export function CommunitySection({ language, marketPath, posts }: { language: string; marketPath: string; posts: MarketPostView[] }) {
  const copy = communityCopy(language);
  return (
    <section className="market-section-grid">
      <article className="market-section-card">
        <Users aria-hidden />
        <h2>{copy.requestTitle}</h2>
        <p>{copy.requestBody}</p>
        <Link href={`${marketPath}/search/`}>{copy.requestAction}</Link>
      </article>
      <article className="market-section-card">
        <Trophy aria-hidden />
        <h2>{copy.voteTitle}</h2>
        <p>{posts[0]?.title ?? copy.voteBody}</p>
        <Link href={`${marketPath}/reviews/`}>{copy.voteAction}</Link>
      </article>
      <article className="market-section-card">
        <Bell aria-hidden />
        <h2>{copy.alertTitle}</h2>
        <p>{copy.alertBody}</p>
        <Link href={`${marketPath}/subscribe/`}>{copy.alertAction}</Link>
      </article>
    </section>
  );
}

export function MarketSearchPanel({
  language,
  marketPath,
  posts,
  query,
  trends
}: {
  language: string;
  marketPath: string;
  posts: MarketPostView[];
  query: string;
  trends: MarketTrendView[];
}) {
  const copy = searchCopy(language);
  const normalized = query.toLowerCase();
  const postResults = posts.filter((post) => searchablePostText(post).includes(normalized));
  const trendResults = trends.filter((trend) => `${trend.title} ${trend.keyword} ${trend.summary}`.toLowerCase().includes(normalized));
  const hasQuery = normalized.length > 0;
  return (
    <section className="market-section-panel">
      <form className="market-search-form" action={`${marketPath}/search/`} method="get">
        <label htmlFor="market-search">{copy.label}</label>
        <div>
          <input id="market-search" name="q" placeholder={copy.placeholder} type="search" defaultValue={query} />
          <button type="submit"><Search aria-hidden />{copy.button}</button>
        </div>
      </form>
      {hasQuery ? (
        <div className="market-search-results">
          {[...postResults.map((post) => ({ href: `${marketPath}/posts/${post.slug}/`, title: post.title, body: post.summary })), ...trendResults.map((trend) => ({ href: `${marketPath}/trends/${trend.slug}/`, title: trend.title, body: trend.summary }))].map((row) => (
            <Link href={row.href} key={row.href}>
              <strong>{row.title}</strong>
              <span>{row.body}</span>
            </Link>
          ))}
          {postResults.length + trendResults.length === 0 ? <p>{copy.empty}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

export function SubscribeSection({ language, marketPath }: { language: string; marketPath: string }) {
  return (
    <section className="market-section-panel">
      <div className="market-section-icon"><Bell aria-hidden /></div>
      <h2>{subscribeHeading(language)}</h2>
      <p>{subscribeBody(language)}</p>
      <MarketSubscribeForm language={language} market={marketPath.split("/")[1] ?? ""} />
    </section>
  );
}
