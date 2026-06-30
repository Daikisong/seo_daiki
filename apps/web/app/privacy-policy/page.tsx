import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPublicNavCategories } from "@/lib/trend-site/data";
import { trendContactEmail, trendSiteName } from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy | ${trendSiteName}`,
    description: `Privacy policy for ${trendSiteName}.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/privacy-policy/"),
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader
        currentHref="/privacy-policy/"
        navCategories={getPublicNavCategories()}
      />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          Privacy Policy
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            {trendSiteName} uses basic analytics, affiliate-link tracking, and
            server logs to understand site traffic, improve briefs, and measure
            outbound product-link performance.
          </p>
          <p>
            Affiliate links may send readers to third-party merchants such as
            AliExpress, Temu, Amazon, iHerb, or other marketplaces. Those
            merchants process visits, purchases, and account activity under
            their own privacy policies.
          </p>
          <p>
            Readers can avoid affiliate tracking by not clicking outbound
            shopping links. Browser privacy settings, cookie controls, and
            ad-blocking tools may also limit analytics or tracking.
          </p>
          <p>
            Privacy questions or deletion requests can be sent to{" "}
            <a
              className="font-semibold text-[#2f7cd3] hover:text-[#1f5f9f]"
              href={`mailto:${trendContactEmail}`}
            >
              {trendContactEmail}
            </a>
            . Include the page URL or marketplace-link context if the request is
            related to an outbound shopping click.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
