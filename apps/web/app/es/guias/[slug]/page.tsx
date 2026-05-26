import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateFixedLocaleGuideMetadata,
  loadGuidePageForFixedLocale,
  staticGuideParamsForSection
} from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticGuideParamsForSection("es");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateFixedLocaleGuideMetadata(params, "es", searchParams);
}

export default async function SpanishGuidePage({ params, searchParams }: PageProps) {
  const page = await loadGuidePageForFixedLocale(params, "es", "guias", searchParams);
  return <ArticlePage {...page} />;
}
