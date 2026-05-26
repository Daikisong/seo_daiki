import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsFor("data");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "data", searchParams);
}

export default async function DataPage({ params, searchParams }: PageProps) {
  const page = await loadArticlePage(params, "data", searchParams);
  return <ArticlePage {...page} />;
}
