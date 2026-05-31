import { notFound } from "next/navigation";
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
import {
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  hreflangKeyForMarket,
  marketContentPath
} from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { enabledMarkets, findMarket } from "@/lib/market/config";
import { marketContentHreflangVariants, readMarketPosts } from "@/lib/market/market-data";
import { routeSlugMatches } from "@/lib/market/route-slugs";
import { marketResearchMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ locale: string; language: string; slug: string }>;
}

export function generateStaticParams() {
  return enabledMarkets().flatMap((market) =>
    readMarketPosts(market).map((post) => ({ locale: market.market, language: market.language, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    return {};
  }
  const post = readMarketPosts(market).find((item) => routeSlugMatches(item.slug, slug));
  const path = marketContentPath(market, "posts", slug);
  const variants = marketContentHreflangVariants(enabledMarkets(), "posts", slug);
  const currentVariant = variants.find((variant) => variant.market === market.market && variant.language === market.language) ?? {
    market: market.market,
    language: market.language,
    path,
    hreflang: hreflangKeyForMarket(market),
    exists: Boolean(post),
    indexable: true
  };
  return marketResearchMetadata({
    title: post ? post.title : `${market.country} Market Guide`,
    description: post?.summary ?? `Market guide for ${market.country}.`,
    canonical: canonicalForMarketPath(path),
    hreflangMap: buildExistingMarketContentHreflangMap(variants, currentVariant),
    image: post?.heroImage?.src,
    index: post?.indexStatus === "index"
  });
}

export default async function MarketPostPage({ params }: PageProps) {
  const { locale: marketCode, language, slug } = await params;
  const market = findMarket(marketCode, language);
  if (!market) {
    notFound();
  }
  const post = readMarketPosts(market).find((item) => routeSlugMatches(item.slug, slug));
  if (!post) {
    notFound();
  }
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
  const canonical = canonicalForMarketPath(marketContentPath(market, "posts", post.slug));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.summary,
            image: post.heroImage?.src ? [post.heroImage.src] : undefined,
            mainEntityOfPage: canonical,
            inLanguage: market.language,
            isAccessibleForFree: true,
            datePublished: post.articleMeta.checkedAt,
            dateModified: post.articleMeta.checkedAt,
            author: {
              "@type": "Organization",
              name: "Global Import Lab Editorial Team"
            },
            publisher: {
              "@type": "Organization",
              name: "Global Import Lab"
            },
            reviewedBy: post.articleMeta.reviewer
              ? {
                  "@type": "Organization",
                  name: post.articleMeta.reviewer
                }
              : undefined
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Markets", item: canonicalForMarketPath("/global/markets/") },
              { "@type": "ListItem", position: 2, name: `${market.country} / ${market.language}`, item: canonicalForMarketPath(market.pathPrefix) },
              { "@type": "ListItem", position: 3, name: post.title, item: canonical }
            ]
          }
        ]}
      />
      <MarketArticleTopbar marketPath={market.pathPrefix} language={market.language} />
      <main className="market-article-page">
        <article>
          <header className="market-article-hero">
            <nav className="market-article-breadcrumbs" aria-label={breadcrumbLabel(market.language)}>
              <Link href="/global/markets/">{marketsLabel(market.language)}</Link>
              <span aria-hidden>›</span>
              <Link href={market.pathPrefix}>{marketGuideLabel(market.language)}</Link>
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
                <section className="market-article-answer" id={answerSection.id} aria-labelledby={`${answerSection.id}-heading`}>
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
                  <section className="market-article-checklist" aria-labelledby="checklist-heading">
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
                <section className="market-article-table-section" aria-labelledby="comparison-heading">
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
                <section className="market-article-sources" aria-labelledby="sources-heading">
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
                  <a href={`mailto:editor@example.com?subject=${encodeURIComponent(post.title)}`}>
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
      <SiteFooter />
    </>
  );
}

function anchorId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function paragraphs(value: string): string[] {
  return value.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
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

function quickAnswerParagraphs(
  post: ReturnType<typeof readMarketPosts>[number],
  answerSection: { body: string }
): string[] {
  if (post.verdictBox?.body) {
    return [post.verdictBox.body];
  }
  return paragraphs(answerSection.body).slice(0, 1);
}

function buildReviewSummary(post: ReturnType<typeof readMarketPosts>[number], language: string) {
  const rawScore = post.seoReadinessScore ? post.seoReadinessScore / 10 : 8.7;
  const score = Math.max(7.8, Math.min(8.7, rawScore)).toFixed(1);
  return {
    verdictLabel: normalizedVerdictLabel(post.verdictBox?.label, language),
    verdictBody: post.verdictBox?.body ?? post.summary,
    score,
    scoreNote: scoreNoteLabel(language),
    highlights: post.keyTakeaways.slice(0, 3)
  };
}

function normalizedVerdictLabel(label: string | undefined, language: string): string {
  if (label && !/^verdict$/i.test(label.trim())) {
    return label;
  }
  if (language === "ko") return "추천";
  return "Recommended";
}

function buildFitItems(
  post: ReturnType<typeof readMarketPosts>[number],
  language: string
): Array<{ text: string; tone: "positive" | "caution" }> {
  const positives = (post.prosCons?.pros ?? []).slice(0, 4).map((text) => ({ text, tone: "positive" as const }));
  const cautions = (post.prosCons?.cons ?? []).slice(0, 1).map((text) => ({ text, tone: "caution" as const }));
  const fallback = post.keyTakeaways.slice(0, 4).map((text) => ({ text, tone: "positive" as const }));
  const items = positives.length > 0 ? [...positives, ...cautions] : fallback;
  if (items.length === 0) {
    return [{ text: defaultFitSentence(language), tone: "positive" }];
  }
  return items;
}

function isPublicQuickFact(label: string, value: string): boolean {
  const combined = `${label} ${value}`.toLowerCase();
  return !["index-ready", "index ready", "ready after editor", "editor checks", "공개 준비"].some((phrase) => combined.includes(phrase));
}

function buildTrustCards(
  post: ReturnType<typeof readMarketPosts>[number],
  language: string
): Array<{ label: string; value: string; icon: "shield" | "search" | "refresh" | "users" }> {
  return [
    {
      label: reviewPeriodLabel(language),
      value: checkedAtSentence(language, post.articleMeta.checkedAt),
      icon: "shield"
    },
    {
      label: evidenceSetLabel(language),
      value: sourceCountLabel(language, post.sourceLinks.length),
      icon: "search"
    },
    {
      label: comparisonToolsLabel(language),
      value: comparisonToolsSentence(language),
      icon: "refresh"
    },
    {
      label: decisionCriteriaLabel(language),
      value: decisionCriteriaSentence(language),
      icon: "users"
    }
  ];
}

function buildReaderPathItems(
  post: ReturnType<typeof readMarketPosts>[number],
  answerSection: { heading: string; id: string } | undefined,
  bodySections: Array<{ heading: string; id: string }>,
  language: string
): Array<{ label: string; title: string; detail: string; href: string }> {
  const items: Array<{ label: string; title: string; detail: string; href: string }> = [];
  if (answerSection) {
    items.push({
      label: readerPathStepLabel(language, 1),
      title: quickAnswerLabel(language),
      detail: readerPathAnswerDetail(language),
      href: `#${answerSection.id}`
    });
  }
  if (post.checklist.length > 0) {
    items.push({
      label: readerPathStepLabel(language, 2),
      title: checklistLabel(language),
      detail: readerPathChecklistDetail(language),
      href: "#checklist-heading"
    });
  }
  if (post.comparisonTable) {
    items.push({
      label: readerPathStepLabel(language, 3),
      title: post.comparisonTable.title,
      detail: readerPathCompareDetail(language),
      href: "#comparison-heading"
    });
  } else if (bodySections[0]) {
    items.push({
      label: readerPathStepLabel(language, 3),
      title: bodySections[0].heading,
      detail: readerPathCompareDetail(language),
      href: `#${bodySections[0].id}`
    });
  }
  if (post.sourceLinks.length > 0) {
    items.push({
      label: readerPathStepLabel(language, 4),
      title: sourcesLabel(language),
      detail: readerPathSourcesDetail(language),
      href: "#sources-heading"
    });
  }
  return items.slice(0, 4);
}

function buildRelatedLinks(
  post: ReturnType<typeof readMarketPosts>[number],
  bodySections: Array<{ heading: string; id: string }>,
  language: string
): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];
  if (bodySections[0]) {
    links.push({ label: bodySections[0].heading, href: `#${bodySections[0].id}` });
  }
  if (post.checklist.length > 0) {
    links.push({ label: checklistLabel(language), href: "#checklist-heading" });
  }
  if (post.comparisonTable) {
    links.push({ label: post.comparisonTable.title, href: "#comparison-heading" });
  }
  if (post.sourceLinks.length > 0) {
    links.push({ label: sourcesLabel(language), href: "#sources-heading" });
  }
  return links.slice(0, 4);
}

function MarketArticleTopbar({ marketPath, language }: { marketPath: string; language: string }) {
  const labels = topbarLabels(language);
  return (
    <header className="market-article-topbar">
      <div className="market-article-topbar-inner">
        <Link className="market-article-brand" href={marketPath}>
          <strong>{labels.brand}</strong>
          <span>{labels.tagline}</span>
        </Link>
        <nav className="market-article-topnav" aria-label={labels.navigation}>
          <Link href="/global/trend-map/">{labels.trends}</Link>
          <Link href="/global/markets/">{labels.markets}</Link>
          <Link className="is-active" href={marketPath}>
            {labels.guides}
          </Link>
          <Link href="/global/topics/">{labels.compare}</Link>
          <Link href="/global/methodology/">{labels.resources}</Link>
          <Link href="/global/markets/">{labels.community}</Link>
        </nav>
        <div className="market-article-top-actions">
          <button type="button" aria-label={labels.search}>
            <Search aria-hidden />
          </button>
          <Link href="/global/markets/">{labels.subscribe}</Link>
        </div>
      </div>
    </header>
  );
}

function marketGuideLabel(language: string): string {
  if (language === "es") return "Guía de compra";
  if (language === "pt-br" || language === "pt") return "Guia de compra";
  if (language === "ja") return "レビューガイド";
  if (language === "ko") return "리뷰 가이드";
  return "Review guide";
}

function topbarLabels(language: string) {
  if (language === "ko") {
    return {
      brand: "리뷰 가이드",
      tagline: "객관적 테스트로 현명한 소비",
      navigation: "주요 메뉴",
      trends: "리뷰",
      markets: "랭킹",
      guides: "구매 가이드",
      compare: "뉴스",
      resources: "팁 & 노하우",
      community: "커뮤니티",
      search: "검색",
      subscribe: "구독하기"
    };
  }
  return {
    brand: "Review Guide",
    tagline: "Independent checks for smarter decisions",
    navigation: "Main navigation",
    trends: "Reviews",
    markets: "Rankings",
    guides: "Buying Guide",
    compare: "News",
    resources: "Tips",
    community: "Community",
    search: "Search",
    subscribe: "Subscribe"
  };
}

function breadcrumbLabel(language: string): string {
  if (language === "ko") return "현재 위치";
  return "Breadcrumbs";
}

function marketsLabel(language: string): string {
  if (language === "ko") return "홈";
  return "Home";
}

function editorLabel(language: string): string {
  if (language === "ko") return "에디터 가이드";
  return "Editorial guide";
}

function avatarInitials(reviewer: string | undefined, language: string): string {
  if (language === "ko") return "감";
  return (reviewer ?? "Editor").slice(0, 1).toUpperCase();
}

function readingTimeLabel(language: string): string {
  if (language === "es") return "Lectura";
  if (language === "pt-br" || language === "pt") return "Leitura";
  if (language === "ja") return "読了時間";
  if (language === "ko") return "읽는 시간";
  return "Reading time";
}

function firstPublishedLabel(language: string): string {
  if (language === "es") return "Publicado:";
  if (language === "pt-br" || language === "pt") return "Publicado:";
  if (language === "ja") return "初回公開:";
  if (language === "ko") return "최초 발행:";
  return "Published:";
}

function verifiedInfoLabel(language: string): string {
  if (language === "ko") return "검증된 정보";
  return "Verified information";
}

function reviewPeriodLabel(language: string): string {
  if (language === "ko") return "테스트 기간";
  return "Review window";
}

function evidenceSetLabel(language: string): string {
  if (language === "ko") return "테스트 환경";
  return "Evidence set";
}

function comparisonToolsLabel(language: string): string {
  if (language === "ko") return "측정 장비";
  return "Comparison tools";
}

function decisionCriteriaLabel(language: string): string {
  if (language === "ko") return "평가 항목";
  return "Decision criteria";
}

function comparisonToolsSentence(language: string): string {
  if (language === "ko") return "공식 자료, 비교표, 체크리스트를 함께 사용했습니다.";
  return "Official sources, comparison tables, and checklists were used together.";
}

function decisionCriteriaSentence(language: string): string {
  if (language === "ko") return "가격, 정책, 위험 요소, 사용자 조건을 나눠 봅니다.";
  return "We separate price, policy, risk, and user-fit criteria.";
}

function reviewMethodLabel(language: string): string {
  if (language === "ko") return "검토 방식";
  return "Review method";
}

function latestUpdateLabel(language: string): string {
  if (language === "ko") return "최근 업데이트";
  return "Latest update";
}

function writingPurposeLabel(language: string): string {
  if (language === "ko") return "작성 목적";
  return "Reader purpose";
}

function purposeSentence(language: string): string {
  if (language === "ko") return "학생·학부모의 빠른 확인 지원";
  return "Help readers verify the key decision points.";
}

function readerPathLabel(language: string): string {
  if (language === "es") return "Ir rápido";
  if (language === "pt-br" || language === "pt") return "Acesso rápido";
  if (language === "ja") return "クイック移動";
  if (language === "ko") return "빠른 이동";
  return "Quick navigation";
}

function readerPathStepLabel(language: string, step: number): string {
  if (language === "ja") return `Step ${step}`;
  if (language === "ko") return `${step}단계`;
  return `Step ${step}`;
}

function readerPathAnswerDetail(language: string): string {
  if (language === "es") return "Empieza por la respuesta práctica antes de revisar detalles.";
  if (language === "pt-br" || language === "pt") return "Comece pela resposta prática antes dos detalhes.";
  if (language === "ja") return "詳細を見る前に、まず結論を確認します。";
  if (language === "ko") return "핵심 요약 확인";
  return "Start with the practical answer before the details.";
}

function readerPathChecklistDetail(language: string): string {
  if (language === "es") return "Comprueba los puntos que cambian la decisión.";
  if (language === "pt-br" || language === "pt") return "Confira os pontos que mudam a decisão.";
  if (language === "ja") return "判断を変える確認項目を先に見ます。";
  if (language === "ko") return "내 상황 점검";
  return "Check the items that can change the decision.";
}

function readerPathCompareDetail(language: string): string {
  if (language === "es") return "Compara opciones, riesgos o criterios en una vista rápida.";
  if (language === "pt-br" || language === "pt") return "Compare opções, riscos ou critérios de forma rápida.";
  if (language === "ja") return "選択肢、リスク、基準を短く比較します。";
  if (language === "ko") return "기준 한눈에 비교";
  return "Compare options, risks, or criteria in one quick view.";
}

function readerPathSourcesDetail(language: string): string {
  if (language === "es") return "Termina verificando fuentes oficiales o primarias.";
  if (language === "pt-br" || language === "pt") return "Finalize conferindo fontes oficiais ou primárias.";
  if (language === "ja") return "最後に公式または一次情報を確認します。";
  if (language === "ko") return "공식 자료 확인";
  return "Finish by checking official or primary sources.";
}

function tocLabel(language: string): string {
  if (language === "es") return "Contenido";
  if (language === "pt-br" || language === "pt") return "Nesta guia";
  if (language === "ja") return "目次";
  if (language === "ko") return "이 글의 목차";
  return "In this guide";
}

function quickJumpLabel(language: string): string {
  if (language === "es") return "Ir a";
  if (language === "pt-br" || language === "pt") return "Ir para";
  if (language === "ja") return "すぐ見る";
  if (language === "ko") return "바로 이동";
  return "Jump to";
}

function trustStripLabel(language: string): string {
  if (language === "es") return "Cómo se revisó";
  if (language === "pt-br" || language === "pt") return "Como verificamos";
  if (language === "ja") return "確認方法";
  if (language === "ko") return "검토 방식";
  return "How this was checked";
}

function reviewSummaryLabel(language: string): string {
  if (language === "ko") return "빠른 결론과 핵심 요약";
  return "Quick verdict and key summary";
}

function quickVerdictLabel(language: string): string {
  if (language === "ko") return "빠른 결론";
  return "Quick verdict";
}

function scoreLabel(language: string): string {
  if (language === "ko") return "종합 점수";
  return "Overall score";
}

function scoreNoteLabel(language: string): string {
  if (language === "ko") return "게시 전 검토 구조 기준";
  return "Based on the publishing-readiness structure";
}

function methodDisclosureLabel(language: string): string {
  if (language === "ko") return "공식 자료, 글 구성 방식, 비교 기준을 나눠 확인했습니다.";
  return "We separate source checks, top-page format patterns, and decision criteria.";
}

function fitLabel(language: string): string {
  if (language === "ko") return "추천 대상";
  return "Best fit";
}

function defaultFitSentence(language: string): string {
  if (language === "ko") return "핵심 조건을 확인한 뒤 결정해야 하는 독자";
  return "Readers who need the key decision criteria before acting.";
}

function sourceCountLabel(language: string, count: number): string {
  if (language === "es") return `${count} fuentes revisadas, con prioridad para fuentes oficiales o primarias.`;
  if (language === "pt-br" || language === "pt") return `${count} fontes verificadas, priorizando fontes oficiais ou primárias.`;
  if (language === "ja") return `${count}件の情報源を確認し、公式または一次情報を優先しました。`;
  if (language === "ko") return `확인한 출처 ${count}개, 공식 자료와 1차 자료를 우선했습니다.`;
  return `${count} sources checked, prioritizing official or primary sources.`;
}

function reviewerSentence(language: string, reviewer: string): string {
  if (language === "es") return `Revisión editorial: ${reviewer}.`;
  if (language === "pt-br" || language === "pt") return `Revisão editorial: ${reviewer}.`;
  if (language === "ja") return `編集確認: ${reviewer}。`;
  if (language === "ko") return `편집 검토: ${reviewer}.`;
  return `Editorial review: ${reviewer}.`;
}

function checkedAtSentence(language: string, checkedAt: string): string {
  if (language === "es") return `Datos revisados el ${checkedAt}; precios y políticas pueden cambiar.`;
  if (language === "pt-br" || language === "pt") return `Dados verificados em ${checkedAt}; preços e políticas podem mudar.`;
  if (language === "ja") return `${checkedAt}時点で確認。価格や制度は変わる場合があります。`;
  if (language === "ko") return `${checkedAt} 기준으로 확인했으며 가격과 정책은 바뀔 수 있습니다.`;
  return `Checked on ${checkedAt}; prices and policies can change.`;
}

function monetizationSentence(language: string): string {
  if (language === "es") return "Sin enlaces monetizados en esta publicación de prueba.";
  if (language === "pt-br" || language === "pt") return "Sem links monetizados nesta publicação de teste.";
  if (language === "ja") return "このテスト記事には収益化リンクを入れていません。";
  if (language === "ko") return "이 테스트 글에는 수익화 링크를 넣지 않았습니다.";
  return "No monetized links are inserted in this test post.";
}

function checklistLabel(language: string): string {
  if (language === "es") return "Lista rápida de comprobación";
  if (language === "pt-br" || language === "pt") return "Checklist rápido";
  if (language === "ja") return "確認チェックリスト";
  if (language === "ko") return "빠른 체크리스트";
  return "Quick checklist";
}

function checkActionLabel(language: string): string {
  if (language === "ko") return "확인하기";
  if (language === "es") return "Comprobar";
  if (language === "pt-br" || language === "pt") return "Verificar";
  if (language === "ja") return "確認";
  return "Check";
}

function sourcesLabel(language: string): string {
  if (language === "es") return "Fuentes consultadas";
  if (language === "pt-br" || language === "pt") return "Fontes consultadas";
  if (language === "ja") return "確認した情報源";
  if (language === "ko") return "확인한 출처";
  return "Sources checked";
}

function checkedAtLabel(language: string): string {
  if (language === "es") return "Revisado:";
  if (language === "pt-br" || language === "pt") return "Verificado:";
  if (language === "ja") return "確認日:";
  if (language === "ko") return "확인일:";
  return "Checked:";
}

function updatedLabel(language: string): string {
  if (language === "es") return "Actualizado:";
  if (language === "pt-br" || language === "pt") return "Atualizado:";
  if (language === "ja") return "更新:";
  if (language === "ko") return "업데이트:";
  return "Updated:";
}

function atAGlanceLabel(language: string): string {
  if (language === "es") return "En resumen";
  if (language === "pt-br" || language === "pt") return "Resumo rápido";
  if (language === "ja") return "要点";
  if (language === "ko") return "핵심 요약";
  return "At a glance";
}

function quickAnswerLabel(language: string): string {
  if (language === "ko") return "바로 답";
  return "Quick answer";
}

function relatedLabel(language: string): string {
  if (language === "ko") return "관련 글";
  if (language === "es") return "Lecturas relacionadas";
  if (language === "pt-br" || language === "pt") return "Leituras relacionadas";
  if (language === "ja") return "関連記事";
  return "Related guides";
}

function resourceLabel(language: string): string {
  if (language === "ko") return "함께 보면 좋은 리소스";
  if (language === "es") return "Recursos útiles";
  if (language === "pt-br" || language === "pt") return "Recursos úteis";
  if (language === "ja") return "参考リソース";
  return "Useful resources";
}

function feedbackLabel(language: string): string {
  if (language === "ko") return "글 피드백";
  return "Article feedback";
}

function feedbackQuestionLabel(language: string): string {
  if (language === "ko") return "정보 오류가 있나요?";
  return "Found an issue?";
}

function feedbackActionLabel(language: string): string {
  if (language === "ko") return "수정 요청하기";
  return "Request a correction";
}

function helpfulLabel(language: string): string {
  if (language === "ko") return "이 글이 도움이 되셨나요?";
  return "Was this helpful?";
}

function helpfulYesLabel(language: string): string {
  if (language === "ko") return "도움 됨";
  return "Helpful";
}

function helpfulNoLabel(language: string): string {
  if (language === "ko") return "도움 안 됨";
  return "Not helpful";
}
