import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article, ArticleType } from "@global-import-lab/types";
import { articlePath } from "@global-import-lab/seo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getLocaleArticles } from "@/lib/content/repository";
import { isLocale, localeLabel } from "@/lib/i18n/locales";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

const localeHomeTypes = new Set<ArticleType>(["trend", "buyer_guide", "deal_watch", "ingredient_guide"]);

const localeTypeLabel: Record<ArticleType, string> = {
  hub: "Hub",
  review: "Review",
  guide: "Guide",
  compare: "Compare",
  data: "Data",
  lab: "Lab",
  risk: "Risk",
  methodology: "Method",
  trend: "Trend Guide",
  buyer_guide: "Buyer Guide",
  deal_watch: "Deal Watch",
  ingredient_guide: "Ingredient Guide"
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }, { locale: "pt-br" }];
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const articles = (await getLocaleArticles(localeParam))
    .filter((article) => article.publishStatus === "published" && article.indexStatus === "index" && localeHomeTypes.has(article.type))
    .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated));

  return (
    <>
      <SiteHeader locale={localeParam} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="border-b border-neutral-200 pb-8">
          <h1 className="text-3xl font-black leading-tight text-neutral-950 md:text-5xl">
            Trend Picks in {localeLabel(localeParam)}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
            Localized trend guides, buyer guides, deal checks, and ingredient guides for this language.
          </p>
        </section>

        <section className="py-10">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-3 w-3 rotate-45 bg-[#e45f14]" />
            <h2 className="text-2xl font-black text-[#105aa3]">Latest Guides</h2>
          </div>
          <div className="mt-6 border-t border-neutral-200">
            {articles.map((article) => (
              <LocaleArticleRow article={article} key={article.id} />
            ))}
            {articles.length === 0 ? (
              <p className="border-b border-neutral-200 py-5 text-sm text-neutral-600">
                No public trend guides are published for this language yet.
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter language={localeParam} />
    </>
  );
}

function LocaleArticleRow({ article }: { article: Article }) {
  return (
    <Link className="focus-ring block border-b border-neutral-200 py-5 hover:text-[#105aa3]" href={articlePath(article)}>
      <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase text-[#105aa3]">
        <span>{localeTypeLabel[article.type]}</span>
        <span className="h-1.5 w-1.5 rotate-45 bg-[#e45f14]" />
        <span>{article.lastUpdated}</span>
      </div>
      <h3 className="mt-2 text-xl font-black leading-tight text-neutral-950">{article.title}</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-700">{article.summary}</p>
    </Link>
  );
}
