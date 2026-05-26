import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("methodology");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "methodology");
}

export default async function MethodologyPage({ params }: PageProps) {
  const page = await loadArticlePage(params, "methodology");
  return <ArticlePage {...page} />;
}
