import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateArticleMetadata,
  loadArticlePageForLocalizedSection,
  staticParamsForLocalizedSection
} from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsForLocalizedSection("deal_watch", "deals");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "deal_watch", searchParams);
}

export default async function DealWatchPage({ params, searchParams }: PageProps) {
  const page = await loadArticlePageForLocalizedSection(params, "deal_watch", "deals", searchParams);
  return <ArticlePage {...page} />;
}
