import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, ExternalLink } from "lucide-react";
import {
  buildExistingMarketContentHreflangMap,
  canonicalForMarketPath,
  hreflangKeyForMarket,
  marketContentPath
} from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
      <SiteHeader />
      <main className="market-article-page">
        <article>
          <header className="market-article-hero">
            <div className="market-article-hero-copy">
              <p className="market-article-kicker">{marketGuideLabel(market.language)}</p>
              <h1 className="market-article-title">{post.title}</h1>
              <p className="market-article-deck">{post.summary}</p>
              {post.articleMeta.checkedAt ? (
                <div className="market-article-meta">
                  <span className="market-article-meta-item">
                    <Clock3 aria-hidden />
                    {updatedLabel(market.language)} <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
                  </span>
                  <span>{post.articleMeta.readingTime}</span>
                  {post.articleMeta.reviewer ? <span>{post.articleMeta.reviewer}</span> : null}
                  <span>{post.articleMeta.basis}</span>
                </div>
              ) : null}
            </div>
            {post.heroImage ? (
              <figure className="market-article-hero-media">
                <img src={post.heroImage.src} alt={post.heroImage.alt} />
                <figcaption>{post.heroImage.caption}</figcaption>
              </figure>
            ) : null}
            {publicQuickFacts.length > 0 ? (
              <dl className="market-article-fact-rail">
                {publicQuickFacts.map((fact) => (
                  <div key={`${fact.label}-${fact.value}`}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </header>

          <div className="market-article-shell">
            <div className="market-article-main">
              {answerSection ? (
                <section className="market-article-answer" id={answerSection.id} aria-labelledby={`${answerSection.id}-heading`}>
                  <h2 id={`${answerSection.id}-heading`}>{answerSection.heading}</h2>
                  {paragraphs(answerSection.body).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ) : null}

              <section className="market-article-snapshot" aria-labelledby="at-a-glance-heading">
                <div className="market-article-glance">
                  <h2 id="at-a-glance-heading">{atAGlanceLabel(market.language)}</h2>
                  <ul>
                    {post.keyTakeaways.map((item) => (
                      <li key={item}>
                        <CheckCircle2 aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {post.verdictBox ? (
                  <div className="market-article-verdict">
                    <p>{post.verdictBox.label}</p>
                    <strong>{post.verdictBox.body}</strong>
                  </div>
                ) : null}
              </section>

              {post.checklist.length > 0 ? (
                <section className="market-article-checklist" aria-labelledby="checklist-heading">
                  <h2 id="checklist-heading">{checklistLabel(market.language)}</h2>
                  <ul>
                    {post.checklist.map((item) => (
                      <li key={item}>
                        <CheckCircle2 aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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

function isPublicQuickFact(label: string, value: string): boolean {
  const combined = `${label} ${value}`.toLowerCase();
  return !["index-ready", "index ready", "ready after editor", "editor checks", "공개 준비"].some((phrase) => combined.includes(phrase));
}

function marketGuideLabel(language: string): string {
  if (language === "es") return "Guía de mercado";
  if (language === "pt-br" || language === "pt") return "Guia de mercado";
  if (language === "ja") return "マーケットガイド";
  if (language === "ko") return "시장 가이드";
  return "Market guide";
}

function tocLabel(language: string): string {
  if (language === "es") return "Contenido";
  if (language === "pt-br" || language === "pt") return "Nesta guia";
  if (language === "ja") return "目次";
  if (language === "ko") return "목차";
  return "In this guide";
}

function checklistLabel(language: string): string {
  if (language === "es") return "Lista rápida de comprobación";
  if (language === "pt-br" || language === "pt") return "Checklist rápido";
  if (language === "ja") return "確認チェックリスト";
  if (language === "ko") return "빠른 체크리스트";
  return "Quick checklist";
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
