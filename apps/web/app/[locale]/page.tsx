import { notFound, permanentRedirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getLocaleArticles } from "@/lib/content/repository";
import { isLocale } from "@/lib/i18n/locales";
import { defaultMarketForLegacyLocale } from "@/lib/market/config";
import Link from "next/link";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }, { locale: "pt-br" }];
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const defaultMarket = defaultMarketForLegacyLocale(localeParam);
  if (defaultMarket) {
    permanentRedirect(`${defaultMarket.pathPrefix}/`);
  }

  const articles = (await getLocaleArticles(localeParam)).filter((article) => article.publishStatus === "published");

  return (
    <>
      <SiteHeader locale={localeParam} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Market trend pages</h1>
        <p className="mt-3 max-w-3xl text-neutral-700">
          Legacy locale pages redirect to explicit market silos such as /us/en/, /es/es/, and /br/pt-br/.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              className="focus-ring rounded-md border border-neutral-200 bg-white p-4 hover:border-teal-700"
              href={article.canonicalUrl ? new URL(article.canonicalUrl).pathname : `/${article.locale}/${article.slug}/`}
              key={article.id}
            >
              <span className="text-xs font-semibold uppercase text-teal-700">{article.type}</span>
              <span className="mt-2 block text-lg font-semibold">{article.title}</span>
              <span className="mt-1 block text-sm text-neutral-600">{article.indexStatus}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
