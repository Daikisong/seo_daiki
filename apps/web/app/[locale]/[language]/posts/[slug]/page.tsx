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
            isAccessibleForFree: true
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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <article>
          <header className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">{marketGuideLabel(market.language)}</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-neutral-950 md:text-5xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">{post.summary}</p>
              {post.articleMeta.checkedAt ? (
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-neutral-600">
                  <span className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-2">
                    <Clock3 className="h-4 w-4 text-teal-700" aria-hidden />
                    {updatedLabel(market.language)} <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
                  </span>
                  <span className="rounded-sm border border-neutral-200 bg-white px-3 py-2">{post.articleMeta.readingTime}</span>
                  <span className="rounded-sm border border-neutral-200 bg-white px-3 py-2">{post.articleMeta.basis}</span>
                </div>
              ) : null}
              {post.quickFacts.length > 0 ? (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {post.quickFacts.map((fact) => (
                    <div className="rounded-md border border-neutral-200 bg-white p-4" key={`${fact.label}-${fact.value}`}>
                      <dt className="text-xs font-semibold uppercase text-neutral-500">{fact.label}</dt>
                      <dd className="mt-1 text-sm leading-6 text-neutral-800">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            {post.heroImage ? (
              <figure className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                <img className="aspect-[4/3] w-full object-cover" src={post.heroImage.src} alt={post.heroImage.alt} />
                <figcaption className="border-t border-neutral-200 px-4 py-3 text-sm leading-6 text-neutral-600">
                  {post.heroImage.caption}
                </figcaption>
              </figure>
            ) : null}
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <aside className="grid gap-5 lg:sticky lg:top-6">
              <nav className="rounded-md border border-neutral-200 bg-white p-4" aria-label="Article table of contents">
                <h2 className="text-sm font-semibold uppercase text-neutral-500">{tocLabel(market.language)}</h2>
                <ol className="mt-3 grid gap-2 text-sm leading-6">
                  {sectionAnchors.map((section) => (
                    <li key={section.id}>
                      <a className="text-neutral-700 hover:text-teal-700" href={`#${section.id}`}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              {post.internalLinks.length > 0 ? (
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <h2 className="text-sm font-semibold uppercase text-neutral-500">{internalLinksLabel(market.language)}</h2>
                  <div className="mt-3 grid gap-3 text-sm">
                    {post.internalLinks.map((link) => (
                      <a className="rounded-sm text-neutral-800 hover:text-teal-700" href={link.href} key={link.href}>
                        <span className="block font-semibold">{link.label}</span>
                        <span className="block text-neutral-600">{link.note}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {post.serpReferences.length > 0 ? (
                <div className="rounded-md border border-neutral-200 bg-white p-4">
                  <h2 className="text-sm font-semibold uppercase text-neutral-500">{topPagesLabel(market.language)}</h2>
                  <div className="mt-3 grid gap-3 text-sm">
                    {post.serpReferences.slice(0, 4).map((reference) => (
                      <a className="group block" href={reference.url} key={`${reference.rank}-${reference.url}`} rel="noopener noreferrer" target="_blank">
                        <span className="block font-semibold text-neutral-900 group-hover:text-teal-700">
                          {reference.rank}. {reference.label}
                        </span>
                        <span className="block leading-6 text-neutral-600">{reference.formatPattern}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="min-w-0">
              <section className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]" aria-labelledby="at-a-glance-heading">
                <div className="rounded-md border border-neutral-200 bg-white p-5">
                  <h2 id="at-a-glance-heading" className="text-xl font-semibold text-neutral-950">
                    {atAGlanceLabel(market.language)}
                  </h2>
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-neutral-800">
                    {post.keyTakeaways.map((item) => (
                      <li className="flex gap-3" key={item}>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {post.verdictBox ? (
                  <div className="rounded-md border border-neutral-900 bg-neutral-950 p-5 text-white">
                    <p className="text-xs font-semibold uppercase text-teal-200">{post.verdictBox.label}</p>
                    <p className="mt-3 text-base leading-7 text-neutral-100">{post.verdictBox.body}</p>
                  </div>
                ) : null}
              </section>

              {post.prosCons ? (
                <section className="mt-6 grid gap-4 md:grid-cols-2" aria-labelledby="pros-cons-heading">
                  <h2 id="pros-cons-heading" className="sr-only">
                    {decisionSignalsLabel(market.language)}
                  </h2>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5">
                    <h3 className="text-lg font-semibold text-neutral-950">{positiveSignalsLabel(market.language)}</h3>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-800">
                      {post.prosCons.pros.map((item) => (
                        <li className="flex gap-3" key={item}>
                          <span className="font-semibold text-emerald-700">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-5">
                    <h3 className="text-lg font-semibold text-neutral-950">{cautionSignalsLabel(market.language)}</h3>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-800">
                      {post.prosCons.cons.map((item) => (
                        <li className="flex gap-3" key={item}>
                          <span className="font-semibold text-amber-700">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ) : null}

              {post.checklist.length > 0 ? (
                <section className="mt-6 rounded-md border border-teal-200 bg-teal-50 p-5" aria-labelledby="checklist-heading">
                  <h2 id="checklist-heading" className="text-xl font-semibold text-neutral-950">
                    {checklistLabel(market.language)}
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {post.checklist.map((item) => (
                      <li className="flex gap-3 text-sm leading-6 text-neutral-800" key={item}>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="mt-10 grid gap-10">
                {sectionAnchors.map((section) => (
                  <section className="scroll-mt-8" id={section.id} key={section.heading}>
                    <h2 className="text-2xl font-semibold tracking-normal text-neutral-950">{section.heading}</h2>
                    <div className="mt-3 grid gap-4 text-base leading-8 text-neutral-700">
                      {paragraphs(section.body).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {post.comparisonTable ? (
                <section className="mt-10" aria-labelledby="comparison-heading">
                  <h2 id="comparison-heading" className="text-2xl font-semibold text-neutral-950">
                    {post.comparisonTable.title}
                  </h2>
                  <div className="mt-4 overflow-x-auto rounded-md border border-neutral-200">
                    <table className="min-w-full border-collapse bg-white text-left text-sm">
                      <thead className="bg-neutral-100 text-neutral-700">
                        <tr>
                          {post.comparisonTable.columns.map((column) => (
                            <th className="border-b border-neutral-200 px-4 py-3 font-semibold" key={column}>
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {post.comparisonTable.rows.map((row) => (
                          <tr className="border-b border-neutral-100 last:border-b-0" key={row.join("|")}>
                            {row.map((cell) => (
                              <td className="align-top px-4 py-3 leading-6 text-neutral-700" key={cell}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {post.sourceLinks.length > 0 ? (
                <section className="mt-10 rounded-md border border-neutral-200 bg-white p-5" aria-labelledby="sources-heading">
                  <h2 id="sources-heading" className="text-2xl font-semibold text-neutral-950">
                    {sourcesLabel(market.language)}
                  </h2>
                  <div className="mt-4 grid gap-4">
                    {post.sourceLinks.map((source) => (
                      <a
                        className="group rounded-md border border-neutral-100 p-4 hover:border-teal-600"
                        href={source.url}
                        key={source.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="flex items-center gap-2 font-semibold text-neutral-950 group-hover:text-teal-700">
                          {source.label}
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </span>
                        {source.checkedAt ? (
                          <span className="mt-1 block text-xs font-semibold uppercase text-neutral-500">
                            {checkedAtLabel(market.language)} {source.checkedAt}
                          </span>
                        ) : null}
                        <span className="mt-1 block text-sm leading-6 text-neutral-600">{source.note}</span>
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
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

function internalLinksLabel(language: string): string {
  if (language === "es") return "Más contexto";
  if (language === "pt-br" || language === "pt") return "Mais contexto";
  if (language === "ja") return "関連リンク";
  if (language === "ko") return "관련 링크";
  return "More context";
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

function decisionSignalsLabel(language: string): string {
  if (language === "es") return "Señales de decisión";
  if (language === "pt-br" || language === "pt") return "Sinais de decisão";
  if (language === "ja") return "判断材料";
  if (language === "ko") return "판단 기준";
  return "Decision signals";
}

function positiveSignalsLabel(language: string): string {
  if (language === "es") return "Buenas señales";
  if (language === "pt-br" || language === "pt") return "Bons sinais";
  if (language === "ja") return "良いサイン";
  if (language === "ko") return "좋은 신호";
  return "Good signs";
}

function cautionSignalsLabel(language: string): string {
  if (language === "es") return "Señales de alerta";
  if (language === "pt-br" || language === "pt") return "Sinais de alerta";
  if (language === "ja") return "注意点";
  if (language === "ko") return "주의 신호";
  return "Watch-outs";
}

function topPagesLabel(language: string): string {
  if (language === "es") return "Páginas revisadas";
  if (language === "pt-br" || language === "pt") return "Páginas analisadas";
  if (language === "ja") return "確認した上位ページ";
  if (language === "ko") return "확인한 상위 페이지";
  return "Top pages checked";
}
