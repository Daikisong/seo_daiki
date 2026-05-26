import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateFixedLocaleGuideMetadata,
  loadGuidePageForFixedLocale,
  staticGuideParamsForSection
} from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return staticGuideParamsForSection("es");
}

export function generateMetadata({ params }: PageProps) {
  return generateFixedLocaleGuideMetadata(params, "es");
}

export default async function SpanishGuidePage({ params }: PageProps) {
  const page = await loadGuidePageForFixedLocale(params, "es", "guias");
  return <ArticlePage {...page} />;
}
