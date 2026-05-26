import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("hub");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "hub");
}

export default async function HubPage({ params }: PageProps) {
  const page = await loadArticlePage(params, "hub");
  return <ArticlePage {...page} />;
}
