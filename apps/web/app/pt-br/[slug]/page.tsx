import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export async function generateStaticParams() {
  const params = await staticParamsFor("hub");
  return params.filter((param) => param.locale === "pt-br").map((param) => ({ slug: param.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params;
  return generateArticleMetadata(Promise.resolve({ locale: "pt-br", slug }), "hub", searchParams);
}

export default async function HubPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const page = await loadArticlePage(Promise.resolve({ locale: "pt-br", slug }), "hub", searchParams);
  return <ArticlePage {...page} />;
}
