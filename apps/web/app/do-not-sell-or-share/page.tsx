import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPublicNavCategories } from "@/lib/trend-site/data";
import { trendContactEmail, trendSiteName } from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Do Not Sell or Share My Personal Information | ${trendSiteName}`,
    description: `Privacy choice page for ${trendSiteName}.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/do-not-sell-or-share/"),
    },
  };
}

export default function DoNotSellOrSharePage() {
  return (
    <>
      <SiteHeader
        currentHref="/do-not-sell-or-share/"
        navCategories={getPublicNavCategories()}
      />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          Do Not Sell or Share My Personal Information
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            {trendSiteName} does not sell personal information for money. Some
            analytics, advertising, or affiliate tracking tools may be
            considered sharing under certain privacy laws.
          </p>
          <p>
            To limit sharing, use browser privacy controls, block third-party
            cookies, or avoid outbound marketplace links that route through
            affiliate tracking.
          </p>
          <p>
            To make a privacy choice request, email{" "}
            <a
              className="font-semibold text-[#2f7cd3] hover:text-[#1f5f9f]"
              href={`mailto:${trendContactEmail}`}
            >
              {trendContactEmail}
            </a>
            . Include the browser, device, and any email address needed to
            identify the request.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
