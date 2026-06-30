import Link from "next/link";
import {
  trendSiteDescription,
  trendSiteName,
} from "@/lib/trend-site/categories";

export function SiteFooter(_: { language?: string } = {}) {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-neutral-600 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-black text-neutral-950">{trendSiteName}</p>
          <p className="mt-2 leading-6">{trendSiteDescription}</p>
          <p className="mt-2 leading-6">
            Price buttons may be affiliate links.
          </p>
          <p className="mt-3">
            &copy; 2026 {trendSiteName} &middot; All rights reserved.
          </p>
        </div>
        <FooterGroup
          links={[
            { href: "/about-me/", label: "About Jacob" },
            { href: "/methodology/", label: "How Briefs work" },
            { href: "/contact/", label: "Contact" },
            { href: "/#latest-briefs", label: "Latest Briefs" },
          ]}
          title="About"
        />
        <FooterGroup
          links={[
            { href: "/privacy-policy/", label: "Privacy Policy" },
            { href: "/terms-of-use/", label: "Terms of Use" },
            {
              href: "/advertising-policy/",
              label: "Advertising and Affiliate Policy",
            },
            { href: "/do-not-sell-or-share/", label: "Do Not Sell or Share" },
          ]}
          title="Policies"
        />
      </div>
    </footer>
  );
}

function FooterGroup({
  links,
  title,
}: {
  links: Array<{
    href: string;
    label: string;
  }>;
  title: string;
}) {
  return (
    <nav aria-label={title}>
      <p className="font-black text-neutral-950">{title}</p>
      <ul className="mt-2 space-y-2">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              className="focus-ring rounded-sm hover:text-[#064fc4]"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
