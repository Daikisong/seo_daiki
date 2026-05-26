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
  return staticParamsForLocalizedSection("buyer_guide", "buyer-guides");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "buyer_guide", searchParams);
}

export default async function BuyerGuidePage({ params, searchParams }: PageProps) {
  const page = await loadArticlePageForLocalizedSection(params, "buyer_guide", "buyer-guides", searchParams);
  return <ArticlePage {...page} />;
}
