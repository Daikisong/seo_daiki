import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, ExternalLink, ListChecks, ShieldCheck } from "lucide-react";
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
  const quickJumpLinks = buildQuickJumpLinks(post, bodySections, market.language);
  const trustItems = buildTrustItems(post, market.language);
  const readerPathItems = buildReaderPathItems(post, answerSection, bodySections, market.language);
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
            <section className="market-article-trust-strip" aria-label={trustStripLabel(market.language)}>
              <div>
                <ShieldCheck aria-hidden />
                <strong>{trustStripLabel(market.language)}</strong>
              </div>
              <ul>
                {trustItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
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

              {quickJumpLinks.length > 0 ? (
                <nav className="market-article-quick-jumps" aria-label={quickJumpLabel(market.language)}>
                  <span>{quickJumpLabel(market.language)}</span>
                  <div>
                    {quickJumpLinks.map((link) => (
                      <a href={link.href} key={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </nav>
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

function buildQuickJumpLinks(
  post: ReturnType<typeof readMarketPosts>[number],
  bodySections: Array<{ heading: string; id: string }>,
  language: string
): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];
  if (post.checklist.length > 0) {
    links.push({ label: checklistLabel(language), href: "#checklist-heading" });
  }
  if (bodySections[0]) {
    links.push({ label: bodySections[0].heading, href: `#${bodySections[0].id}` });
  }
  if (post.comparisonTable) {
    links.push({ label: post.comparisonTable.title, href: "#comparison-heading" });
  }
  if (post.sourceLinks.length > 0) {
    links.push({ label: sourcesLabel(language), href: "#sources-heading" });
  }
  return links.slice(0, 4);
}

function buildTrustItems(post: ReturnType<typeof readMarketPosts>[number], language: string): string[] {
  const sourceCount = post.sourceLinks.length;
  const items = [
    sourceCountLabel(language, sourceCount),
    checkedAtSentence(language, post.articleMeta.checkedAt),
    monetizationSentence(language)
  ];
  if (post.articleMeta.reviewer) {
    items.splice(1, 0, reviewerSentence(language, post.articleMeta.reviewer));
  }
  return items;
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
      title: answerSection.heading,
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

function marketGuideLabel(language: string): string {
  if (language === "es") return "Guía de mercado";
  if (language === "pt-br" || language === "pt") return "Guia de mercado";
  if (language === "ja") return "マーケットガイド";
  if (language === "ko") return "시장 가이드";
  return "Market guide";
}

function readerPathLabel(language: string): string {
  if (language === "es") return "Ruta de lectura";
  if (language === "pt-br" || language === "pt") return "Caminho de leitura";
  if (language === "ja") return "読む順番";
  if (language === "ko") return "읽는 순서";
  return "Reader path";
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
  if (language === "ko") return "세부 설명 전에 결론부터 확인합니다.";
  return "Start with the practical answer before the details.";
}

function readerPathChecklistDetail(language: string): string {
  if (language === "es") return "Comprueba los puntos que cambian la decisión.";
  if (language === "pt-br" || language === "pt") return "Confira os pontos que mudam a decisão.";
  if (language === "ja") return "判断を変える確認項目を先に見ます。";
  if (language === "ko") return "판단을 바꾸는 확인 항목을 먼저 봅니다.";
  return "Check the items that can change the decision.";
}

function readerPathCompareDetail(language: string): string {
  if (language === "es") return "Compara opciones, riesgos o criterios en una vista rápida.";
  if (language === "pt-br" || language === "pt") return "Compare opções, riscos ou critérios de forma rápida.";
  if (language === "ja") return "選択肢、リスク、基準を短く比較します。";
  if (language === "ko") return "선택지, 위험, 기준을 한눈에 비교합니다.";
  return "Compare options, risks, or criteria in one quick view.";
}

function readerPathSourcesDetail(language: string): string {
  if (language === "es") return "Termina verificando fuentes oficiales o primarias.";
  if (language === "pt-br" || language === "pt") return "Finalize conferindo fontes oficiais ou primárias.";
  if (language === "ja") return "最後に公式または一次情報を確認します。";
  if (language === "ko") return "마지막으로 공식 자료와 1차 자료를 확인합니다.";
  return "Finish by checking official or primary sources.";
}

function tocLabel(language: string): string {
  if (language === "es") return "Contenido";
  if (language === "pt-br" || language === "pt") return "Nesta guia";
  if (language === "ja") return "目次";
  if (language === "ko") return "목차";
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
