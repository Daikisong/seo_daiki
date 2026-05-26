import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsFor("compare");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "compare", searchParams);
}

export default async function ComparePage({ params, searchParams }: PageProps) {
  const page = await loadArticlePage(params, "compare", searchParams);
  return <ArticlePage {...page} />;
}
