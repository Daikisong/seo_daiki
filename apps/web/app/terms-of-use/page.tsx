import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { trendSiteName } from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Terms of Use | ${trendSiteName}`,
    description: `Terms of use for ${trendSiteName}.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/terms-of-use/"),
    },
  };
}

export default function TermsOfUsePage() {
  return (
    <>
      <SiteHeader currentHref="/terms-of-use/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          Terms of Use
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            {trendSiteName} publishes informational buyer notes and briefs.
            Product prices, stock, shipping terms, warranty routes, return
            windows, and marketplace listings can change after publication.
          </p>
          <p>
            Readers should verify the exact product variant, seller, final
            shipped price, local compatibility, warranty territory, and return
            path before buying.
          </p>
          <p>
            {trendSiteName} may link to third-party marketplaces. Purchases,
            refunds, delivery issues, and account questions are handled by the
            merchant under that merchant&apos;s own terms.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
