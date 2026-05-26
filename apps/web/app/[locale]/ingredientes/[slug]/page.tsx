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
  return staticParamsForLocalizedSection("ingredient_guide", "ingredientes");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "ingredient_guide", searchParams);
}

export default async function IngredientGuidePage({ params, searchParams }: PageProps) {
  const page = await loadArticlePageForLocalizedSection(params, "ingredient_guide", "ingredientes", searchParams);
  return <ArticlePage {...page} />;
}
