import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { trendSiteName } from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Advertising and Affiliate Policy | ${trendSiteName}`,
    description: `Advertising and affiliate policy for ${trendSiteName}.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/advertising-policy/"),
    },
  };
}

export default function AdvertisingPolicyPage() {
  return (
    <>
      <SiteHeader currentHref="/advertising-policy/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          Advertising and Affiliate Policy
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            {trendSiteName} may earn a commission when readers buy through some
            outbound product links. Those links may point to AliExpress, Temu,
            Amazon, iHerb, or other merchants.
          </p>
          <p>
            Affiliate availability does not decide whether a product deserves a
            recommendation. A product still needs a clear buyer fit,
            understandable specs, a price that makes sense, and risks readers
            can check before checkout.
          </p>
          <p>
            Sponsored or paid placements should be labeled when they are
            published. Original usage notes appear only with the exact product
            variant and the context behind the observation.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
