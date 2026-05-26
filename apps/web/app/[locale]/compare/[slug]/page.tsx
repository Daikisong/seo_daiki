import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("compare");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "compare");
}

export default async function ComparePage({ params }: PageProps) {
  const page = await loadArticlePage(params, "compare");
  return <ArticlePage {...page} />;
}
