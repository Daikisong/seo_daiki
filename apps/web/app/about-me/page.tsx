import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  trendSiteDescription,
  trendSiteName,
} from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `About Jacob | ${trendSiteName}`,
    description: `About Jacob, the operator behind ${trendSiteName}: ${trendSiteDescription}.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/about-me/"),
    },
  };
}

export default function AboutMePage() {
  return (
    <>
      <SiteHeader currentHref="/about-me/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          About Jacob
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            Hi, I&apos;m Jacob. I publish {trendSiteName}, a collection of buyer
            notes for fast-moving trends across AliExpress, Temu, Amazon, iHerb,
            and local retailers.
          </p>
          <p>
            A TrendBrief starts when a trend creates a real buying question:
            which product category actually solves the problem, which listings
            are easy to misunderstand, and what a reader should verify before
            clicking a price button.
          </p>
          <p>
            Most Briefs compare public specs, merchant listings, current prices,
            warranty or return terms, seller signals, credible third-party
            coverage, and repeated buyer-review complaints.
          </p>
          <p>
            The goal is simple: help readers understand why a product is worth
            checking, who it fits, who should skip it, and what can go wrong
            after checkout.
          </p>
          <p>
            Each Brief should make the exact variant, price route, region fit,
            review pattern, and return or warranty risk clear enough for a
            practical buying decision.
          </p>
          <p>
            Region fit matters. A product that makes sense in one country can be
            a poor recommendation elsewhere if the voltage, plug, sizing,
            ingredients, warranty territory, local stock, or return route does
            not match the reader&apos;s market.
          </p>
          <p>
            Corrections matter too. If a model number, price note, availability
            note, or product classification looks wrong, send the exact page and
            correction details through the contact page so the Brief can be
            updated.
          </p>
          <p>
            Product links may be paid affiliate links. That does not make a weak
            product stronger; it only gives the reader a place to check the
            current price when the buying case already makes sense.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
