"use client";

import Link from "next/link";
import { Bookmark, CheckCircle2, ExternalLink } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { articleContactMailto } from "@/lib/market/article-contact-mailto";
import type { MarketPostView } from "@/lib/market/market-data-types";
import { newsDetailLabels } from "./market-news-post-detail-labels";
import { buildNewsKeyPoints, buildNewsSections, paragraphs } from "./market-news-post-detail-model";

interface MarketNewsPostDetailProps {
  country: string;
  language: string;
  marketPath: string;
  post: MarketPostView;
  previousPost?: AdjacentNewsPostLink;
  nextPost?: AdjacentNewsPostLink;
}

interface AdjacentNewsPostLink {
  slug: string;
  title: string;
}

export function MarketNewsPostDetail({
  country,
  language,
  marketPath,
  nextPost,
  post,
  previousPost
}: MarketNewsPostDetailProps) {
  const labels = newsDetailLabels(language);
  const postPath = `${marketPath}/posts/${post.slug}/`;
  const sections = buildNewsSections(post, labels.sectionLabel);
  const keyPoints = buildNewsKeyPoints(post, sections);
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");

  function scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    // The topbar is sticky and responsive, so measure it at click time instead of hard-coding one offset.
    const topbar = document.querySelector<HTMLElement>(".market-article-topbar");
    const stickyOffset = (topbar?.getBoundingClientRect().height ?? 74) + 18;
    const targetTop = window.scrollY + target.getBoundingClientRect().top - stickyOffset;

    setActiveSectionId(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
    window.scrollTo({
      behavior: "smooth",
      top: Math.max(0, targetTop)
    });
  }

  function handleTocClick(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
    event.preventDefault();

    setActiveSectionId(sectionId);

    const mobileDetails = event.currentTarget.closest("details");
    if (mobileDetails?.open) {
      mobileDetails.open = false;
      window.requestAnimationFrame(() => scrollToSection(sectionId));
      return;
    }

    scrollToSection(sectionId);
  }

  return (
    <main className="market-news-detail-page">
      <article className="market-news-detail">
        <header className="market-news-detail-hero">
          <nav className="market-news-breadcrumbs" aria-label={labels.breadcrumb}>
            <Link href={marketPath}>{labels.home}</Link>
            <span aria-hidden>›</span>
            <Link href={`${marketPath}/news/`}>{labels.news}</Link>
            <span aria-hidden>›</span>
            <span>{post.title}</span>
          </nav>

          <div className="market-news-label-row">
            <span className="market-news-breaking-label">{labels.breaking}</span>
            <span>{labels.news}</span>
            <span>{post.articleMeta.readingTime || labels.defaultReadingTime}</span>
          </div>

          <h1>{post.title}</h1>
          <p>{post.summary}</p>

          <div className="market-news-meta-row">
            <span>
              {labels.published}: <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
            </span>
            <strong>{labels.updated}</strong>
            <span>
              {labels.lastUpdated}: <time dateTime={post.articleMeta.checkedAt}>{post.articleMeta.checkedAt}</time>
            </span>
            <span>{labels.author}: {post.articleMeta.reviewer || labels.editorialTeam}</span>
            <button type="button" aria-label={labels.save}>
              <Bookmark aria-hidden />
            </button>
          </div>
        </header>

        <div className="market-news-detail-layout">
          <aside className="market-news-toc market-news-toc-desktop" aria-label={labels.toc}>
            <strong>{labels.toc}</strong>
            {renderTocList(sections, activeSectionId, handleTocClick)}
          </aside>

          <div className="market-news-detail-main">
            <details className="market-news-mobile-toc">
              <summary>{labels.toc}</summary>
              {renderTocList(sections, activeSectionId, handleTocClick)}
            </details>

            {keyPoints.length > 0 ? (
              <section className="market-news-keypoints" aria-labelledby="news-keypoints-heading">
                <h2 id="news-keypoints-heading">{labels.keyPoints}</h2>
                <ul>
                  {keyPoints.map((point) => (
                    <li key={point}>
                      <CheckCircle2 aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="market-news-body">
              {sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2>{section.number}. {section.heading}</h2>
                  {paragraphs(section.body).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            <section className="market-news-source-correction" id="sources" aria-label={labels.sourceAndCorrection}>
              <div>
                <h2>{labels.sources}</h2>
                {post.sourceLinks.length > 0 ? (
                  <ul>
                    {post.sourceLinks.slice(0, 5).map((source) => (
                      <li key={source.url}>
                        <a href={source.url} rel="noopener noreferrer" target="_blank">
                          {source.label}
                          <ExternalLink aria-hidden />
                        </a>
                        {source.note ? <span>{source.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{labels.noSources}</p>
                )}
              </div>
              <div>
                <h2>{labels.correction}</h2>
                <p>{labels.correctionBody}</p>
                <a href={articleContactMailto({ language, path: postPath, title: post.title })}>{labels.contact}</a>
              </div>
            </section>

            <nav className="market-news-prev-next" aria-label={labels.prevNext}>
              <span>
                {previousPost ? (
                  <Link href={`${marketPath}/posts/${previousPost.slug}/`}>‹ {previousPost.title}</Link>
                ) : (
                  labels.noPrevious
                )}
              </span>
              <span>
                {nextPost ? (
                  <Link href={`${marketPath}/posts/${nextPost.slug}/`}>{nextPost.title} ›</Link>
                ) : (
                  labels.noNext
                )}
              </span>
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}

function renderTocList(
  sections: Array<{ id: string; heading: string; number: number }>,
  activeSectionId: string,
  onTocClick: (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => void
) {
  return (
    <ol>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            className={activeSectionId === section.id ? "is-active" : undefined}
            href={`#${section.id}`}
            onClick={(event) => onTocClick(event, section.id)}
          >
            {section.number}. {section.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}
