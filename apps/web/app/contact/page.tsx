import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | TREND - Jacob",
    description: "Contact TREND - Jacob about product guide corrections, privacy requests, and partnership questions.",
    alternates: {
      canonical: await requestAbsoluteUrl("/contact/")
    }
  };
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader currentHref="/contact/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          Contact
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            For product corrections, privacy requests, affiliate questions, or partnership discussions, email{" "}
            <a className="font-semibold text-[#2f7cd3] hover:text-[#1f5f9f]" href="mailto:contact@trend-jacob.com">
              contact@trend-jacob.com
            </a>
            .
          </p>
          <p>
            Include the article URL, product name, marketplace link, and the issue you want checked. For privacy
            requests, include the email address or browser/session detail needed to identify the request.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
