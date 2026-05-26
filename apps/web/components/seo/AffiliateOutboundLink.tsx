"use client";

import { ExternalLink } from "lucide-react";

interface AffiliateOutboundLinkProps {
  articleId: string;
  href: string;
  label: string;
  locale: string;
  productId?: string;
  rel: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function AffiliateOutboundLink({
  articleId,
  href,
  label,
  locale,
  productId,
  rel
}: AffiliateOutboundLinkProps) {
  return (
    <a
      className="focus-ring inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
      href={href}
      onClick={() => {
        window.gtag?.("event", "affiliate_click", {
          affiliate_label: label,
          article_id: articleId,
          link_url: targetUrlFromTrackingHref(href),
          locale,
          product_id: productId,
          transport_type: "beacon"
        });
      }}
      rel={rel}
    >
      {label}
      <ExternalLink aria-hidden size={16} />
    </a>
  );
}

function targetUrlFromTrackingHref(href: string) {
  try {
    const url = new URL(href, window.location.origin);
    return url.searchParams.get("target") ?? href;
  } catch {
    return href;
  }
}
