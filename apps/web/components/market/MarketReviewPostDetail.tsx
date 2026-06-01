import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  ListChecks,
  RefreshCw,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Users
} from "lucide-react";
import type { MarketConfig } from "@global-import-lab/types";
import { articleContactMailto } from "@/lib/market/article-contact-mailto";
import type { MarketPostView } from "@/lib/market/market-data-types";
import {
  atAGlanceLabel,
  avatarInitials,
  breadcrumbLabel,
  checkActionLabel,
  checkedAtLabel,
  checklistLabel,
  editorLabel,
  feedbackActionLabel,
  feedbackLabel,
  feedbackQuestionLabel,
  firstPublishedLabel,
  fitLabel,
  helpfulLabel,
  helpfulNoLabel,
  helpfulYesLabel,
  marketGuideLabel,
  marketsLabel,
  methodDisclosureLabel,
  quickAnswerLabel,
  quickVerdictLabel,
  readerPathLabel,
  relatedLabel,
  resourceLabel,
  reviewMethodLabel,
  reviewSummaryLabel,
  scoreLabel,
  sourcesLabel,
  tocLabel,
  trustStripLabel,
  updatedLabel
} from "./market-review-post-detail-labels";
import {
  anchorId,
  buildFitItems,
  buildReaderPathItems,
  buildRelatedLinks,
  buildReviewSummary,
  buildTrustCards,
  isPublicQuickFact,
  paragraphs,
  quickAnswerParagraphs
} from "./market-review-post-detail-model";

interface MarketReviewPostDetailProps {
  market: MarketConfig;
  post: MarketPostView;
}

export function MarketReviewPostDetail({ market, post }: MarketReviewPostDetailProps) {
  const sectionAnchors = post.sections.map((section) => ({ ...section, id: anchorId(section.heading) }));
  const [answerSection, ...bodySections] = sectionAnchors;
  const publicQuickFacts = post.quickFacts.filter((fact) => isPublicQuickFact(fact.label, fact.value)).slice(0, 3);
  const trustCards = buildTrustCards(post, market.language);
  const reviewSummary = buildReviewSummary(post, market.language);
  const fitItems = buildFitItems(post, market.language);
  const readerPathItems = buildReaderPathItems(post, answerSection, bodySections, market.language);
  const relatedLinks = buildRelatedLinks(post, bodySections, market.language);
  const visibleSourceLinks = post.sourceLinks.slice(0, 4);
  const visibleChecklist = post.checklist.slice(0, 5);

  return (
    <main className="market-article-page">
      <article>
        <header className="market-article-hero">
          <nav className="market-article-breadcrumbs" aria-label={breadcrumbLabel(market.language)}>
            <Link href="/global/markets/">{marketsLabel(market.language)}</Link>
            <span aria-hidden>›</span>
            <Link href={`${market.pathPrefix}/reviews/`}>{marketGuideLabel(market.language)}</Link>
            <span aria-hidden>›</span>
            <span>{market.country}</span>
          </nav>
          <div className="market-article-hero-copy">
            <p className="market-article-kicker">{marketGuideLabel(market.language)}</p>
            <h1 className="market-article-title">{renderArticleTitle(post.title)}</h1>
            <p className="market-article-deck">{post.summary}</p>
            {post.articleMeta.checkedAt ? (
              <div className="market-article-byline">
                <div className="market-article-avatar" aria-hidden>
                  {avatarInitials(post.articleMeta.reviewer, market.language)}
                </div>
                <div>
                  <strong>{editorLabel(market.language)}</strong>
                  <span>{post.articleMeta.reviewer}</span>
                </div>
                <dl className="market-article-meta">
                  <div>
                    <dt>{updatedLabel(market.language)}</dt>
                    <dd>
                      <Clock3 aria-hidden />
                      <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
                    </dd>
                  </div>
                  <div>
                    <dt>{firstPublishedLabel(market.language)}</dt>
                    <dd>
                      <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
          {post.heroImage ? (
            <figure className="market-article-hero-media">
              <img src={post.heroImage.src} alt={post.heroImage.alt} />
            </figure>
          ) : null}
          <section className="market-article-review-summary" aria-label={reviewSummaryLabel(market.language)}>
            <div className="market-article-review-verdict">
              <p>{quickVerdictLabel(market.language)}</p>
              <strong>{reviewSummary.verdictLabel}</strong>
              <span>{reviewSummary.verdictBody}</span>
            </div>
            <div className="market-article-review-score">
              <p>{scoreLabel(market.language)}</p>
              <strong>
                {reviewSummary.score}
                <span>/10</span>
              </strong>
              <em>{reviewSummary.scoreNote}</em>
            </div>
            <div className="market-article-review-highlights">
              <p>{atAGlanceLabel(market.language)}</p>
              <ul>
                {reviewSummary.highlights.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="market-article-trust-strip" aria-label={trustStripLabel(market.language)}>
            <div className="market-article-method-intro">
              <strong>{reviewMethodLabel(market.language)}</strong>
              <span>{methodDisclosureLabel(market.language)}</span>
            </div>
            <ul>
              {trustCards.map((item) => (
                <li key={item.label}>
                  {item.icon === "shield" ? <ShieldCheck aria-hidden /> : null}
                  {item.icon === "search" ? <Search aria-hidden /> : null}
                  {item.icon === "refresh" ? <RefreshCw aria-hidden /> : null}
                  {item.icon === "users" ? <Users aria-hidden /> : null}
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.value}</em>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </header>

        <div className="market-article-shell">
          <div className="market-article-main">
            <div className="market-article-document">
              {readerPathItems.length > 0 ? (
                <section className="market-article-reader-path" aria-label={readerPathLabel(market.language)}>
                  <div className="market-article-reader-path-heading">
                    <ListChecks aria-hidden />
                    <strong>{readerPathLabel(market.language)}</strong>
                  </div>
                  <ol>
                    {readerPathItems.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <a href={item.href}>
                          <span>{item.label}</span>
                          <strong>{item.title}</strong>
                          <em>{item.detail}</em>
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {answerSection ? (
                <section className="market-article-answer market-article-anchor-target" id={answerSection.id} aria-labelledby={`${answerSection.id}-heading`}>
                  <h2 id={`${answerSection.id}-heading`}>{quickAnswerLabel(market.language)}</h2>
                  {quickAnswerParagraphs(post, answerSection).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {publicQuickFacts.length > 0 ? (
                    <ul className="market-article-answer-facts">
                      {publicQuickFacts.map((fact) => (
                        <li key={`${fact.label}-${fact.value}`}>
                          <CheckCircle2 aria-hidden />
                          <span>{fact.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : null}

              <div className="market-article-decision-grid">
                {visibleChecklist.length > 0 ? (
                  <section className="market-article-checklist market-article-anchor-target" id="checklist" aria-labelledby="checklist-heading">
                    <h2 id="checklist-heading">{checklistLabel(market.language)}</h2>
                    <ul>
                      {visibleChecklist.map((item) => (
                        <li key={item}>
                          <span className="market-article-checkmark" aria-hidden />
                          <span>{item}</span>
                          <button type="button">{checkActionLabel(market.language)}</button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {fitItems.length > 0 ? (
                  <section className="market-article-fit-card" aria-labelledby="fit-heading">
                    <h2 id="fit-heading">{fitLabel(market.language)}</h2>
                    <ul>
                      {fitItems.map((item) => (
                        <li className={item.tone === "caution" ? "is-caution" : undefined} key={item.text}>
                          <CheckCircle2 aria-hidden />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </div>

            <div className="market-article-body-card">
              {post.comparisonTable ? (
                <section className="market-article-table-section market-article-anchor-target" id="comparison" aria-labelledby="comparison-heading">
                  <h2 id="comparison-heading">{post.comparisonTable.title}</h2>
                  <div className="market-article-table-scroll">
                    <table>
                      <thead>
                        <tr>
                          {post.comparisonTable.columns.map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {post.comparisonTable.rows.map((row) => (
                          <tr key={row.join("|")}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {post.sourceLinks.length > 0 ? (
                <section className="market-article-sources market-article-anchor-target" id="sources" aria-labelledby="sources-heading">
                  <h2 id="sources-heading">{sourcesLabel(market.language)}</h2>
                  <div>
                    {post.sourceLinks.map((source) => (
                      <a href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
                        <span>
                          {source.label}
                          <ExternalLink aria-hidden />
                        </span>
                        {source.checkedAt ? (
                          <small>
                            {checkedAtLabel(market.language)} {source.checkedAt}
                          </small>
                        ) : null}
                        <em>{source.note}</em>
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="market-article-prose">
                {bodySections.map((section) => (
                  <section id={section.id} key={section.heading}>
                    <h2>{section.heading}</h2>
                    {paragraphs(section.body).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
              <section className="market-article-feedback" aria-label={feedbackLabel(market.language)}>
                <div>
                  <strong>{feedbackQuestionLabel(market.language)}</strong>
                  <a href={articleContactMailto({ language: market.language, path: `${market.pathPrefix}/posts/${post.slug}/`, title: post.title })}>
                    {feedbackActionLabel(market.language)}
                  </a>
                </div>
                <div>
                  <span>{helpfulLabel(market.language)}</span>
                  <button type="button" aria-label={helpfulYesLabel(market.language)}>
                    <ThumbsUp aria-hidden />
                  </button>
                  <button type="button" aria-label={helpfulNoLabel(market.language)}>
                    <ThumbsDown aria-hidden />
                  </button>
                </div>
              </section>
            </div>
          </div>

          <aside className="market-article-right-rail">
            <nav className="market-article-nav" aria-label="Article table of contents">
              <h2>{tocLabel(market.language)}</h2>
              <ol>
                {sectionAnchors.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
            {relatedLinks.length > 0 ? (
              <section className="market-article-side-card" aria-labelledby="related-heading">
                <h2 id="related-heading">{relatedLabel(market.language)}</h2>
                <ul>
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {visibleSourceLinks.length > 0 ? (
              <section className="market-article-side-card" aria-labelledby="resources-heading">
                <h2 id="resources-heading">{resourceLabel(market.language)}</h2>
                <ul>
                  {visibleSourceLinks.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noopener noreferrer" target="_blank">
                        <FileText aria-hidden />
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}

function renderArticleTitle(title: string) {
  const [lead, rest] = title.split(/:\s+/, 2);
  if (!lead || !rest) {
    return title;
  }
  return (
    <>
      <span>{lead}:</span>
      <span>{rest}</span>
    </>
  );
}
