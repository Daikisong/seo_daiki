import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  authorArticlePath,
  latestAuthorArticles,
  publicTrendAuthors,
  trendAuthors,
} from "@/lib/trend-site/authors";
import { getIndexedArticles } from "@/lib/trend-site/data";
import {
  trendContentUnitPlural,
  trendSiteDescription,
  trendSiteName,
} from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicTrendAuthors.map((author) => ({
    slug: author.authorPagePath.split("/").filter(Boolean).at(-1) ?? author.id,
  }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) {
    return {};
  }

  return {
    title: author.name,
    description: author.shortBio,
    alternates: {
      canonical: await requestAbsoluteUrl(author.authorPagePath),
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) {
    notFound();
  }

  const articles = latestAuthorArticles(author, getIndexedArticles());
  const pageUrl = await requestAbsoluteUrl(author.authorPagePath);

  return (
    <>
      <SiteHeader currentHref={author.authorPagePath} />
      <main className="mx-auto max-w-[960px] px-5 py-10 text-neutral-900">
        <JsonLd data={authorJsonLd(author, pageUrl)} />
        <header className="grid gap-6 border-b border-neutral-200 pb-8 md:grid-cols-[120px_minmax(0,1fr)]">
          <div
            aria-hidden
            className="flex h-24 w-24 items-center justify-center rounded-full bg-[#5d84b4] text-2xl font-black text-white"
          >
            {author.avatarInitials}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-neutral-500">
              {trendSiteName} author
            </p>
            <h1 className="mt-2 text-[32px] font-black leading-[35px] text-neutral-950">
              {author.name}
            </h1>
            <p className="mt-2 text-lg font-bold text-neutral-700">
              {author.role}
            </p>
            <p className="mt-5 text-base leading-7 text-neutral-700">
              {author.longBio}
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <AuthorList title="Covers" items={author.expertiseAreas} />
          <AuthorList title="Categories" items={author.coveredCategories} />
        </section>

        <section className="mt-8 border-l-4 border-cyan-500 bg-cyan-50 px-5 py-4">
          <h2 className="text-lg font-black text-neutral-950">
            How this role supports Briefs
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            {author.methodologyNote}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            {author.evidenceNote}
          </p>
        </section>

        <section className="mt-10">
          <div className="border-b-4 border-cyan-500 pb-3">
            <h2 className="text-[28px] font-bold leading-[31px] text-[#2b2f33]">
              Latest {trendContentUnitPlural} by {author.name}
            </h2>
          </div>
          {articles.length > 0 ? (
            <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
              {articles.map((article) => (
                <article className="py-5" key={article.id}>
                  <a
                    className="text-lg font-black leading-6 text-neutral-950 underline decoration-[#2f7cd3] decoration-2 underline-offset-4 hover:text-[#2f7cd3]"
                    href={authorArticlePath(article)}
                  >
                    {article.title}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {article.metaDescription}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase text-neutral-500">
                    Updated {article.lastUpdated}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-neutral-700">
              New {trendContentUnitPlural.toLowerCase()} will appear here after
              publication.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function AuthorList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-lg font-black text-neutral-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function authorBySlug(slug: string) {
  return publicTrendAuthors.find(
    (author) =>
      author.authorPagePath.split("/").filter(Boolean).at(-1) === slug,
  );
}

function authorJsonLd(author: (typeof trendAuthors)[number], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": author.id === "trendbrief-editors" ? "Organization" : "Person",
      name: author.name,
      url: pageUrl,
      description: author.shortBio,
      jobTitle: author.role,
      sameAs: author.sameAs,
    },
    name: author.name,
    description: `${author.shortBio} ${trendSiteDescription}.`,
    url: pageUrl,
  };
}
