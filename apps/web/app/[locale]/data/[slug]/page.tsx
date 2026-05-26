import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("data");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "data");
}

export default async function DataPage({ params }: PageProps) {
  const page = await loadArticlePage(params, "data");
  return <ArticlePage {...page} />;
}
