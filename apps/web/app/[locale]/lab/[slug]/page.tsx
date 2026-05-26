import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadArticlePage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("lab");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "lab");
}

export default async function LabPage({ params }: PageProps) {
  const page = await loadArticlePage(params, "lab");
  return <ArticlePage {...page} />;
}
