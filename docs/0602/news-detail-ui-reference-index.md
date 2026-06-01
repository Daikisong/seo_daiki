# News Detail UI References

Generated for the news detail page direction.

The review detail page can keep the product-review structure. News detail pages
should use a different article format:

```text
news detail
-> headline, date, source count, key summary, timeline/source/context

not
-> product score, comparison table, recommendation badge, affiliate CTA
```

## References

1. [Editorial source sidebar](./news-detail-ui-references/news-detail-ui-ref-01.png)
   - Large headline, article column, source/fact sidebar.

2. [Briefing-first layout](./news-detail-ui-references/news-detail-ui-ref-02.png)
   - Top summary panel, timeline, practical next steps.

3. [Fact-check layout](./news-detail-ui-references/news-detail-ui-ref-03.png)
   - Confirmed/unconfirmed status strip and source credibility area.

4. [Timeline-driven layout](./news-detail-ui-references/news-detail-ui-ref-04.png)
   - Developing-news page with event timeline and update status.

5. [Minimal news wire](./news-detail-ui-references/news-detail-ui-ref-05.png)
   - Text-forward article with footnotes and a small table of contents.

6. [Direct-answer explainer](./news-detail-ui-references/news-detail-ui-ref-06.png)
   - Strong answer block plus reader checklist.

7. [Magazine analysis](./news-detail-ui-references/news-detail-ui-ref-07.png)
   - Longform news analysis with hero image and data callouts.

8. [Q&A explainer](./news-detail-ui-references/news-detail-ui-ref-08.png)
   - Question sections, source labels, update note.

9. [Data-light policy/news](./news-detail-ui-references/news-detail-ui-ref-09.png)
   - Context metrics and small chart, not review scores.

10. [Article hub/detail hybrid](./news-detail-ui-references/news-detail-ui-ref-10.png)
    - Article body with related news, sources, and update history.

## Recommended Direction

Use reference 6 or 10 as the implementation base.

Reason:

```text
6 gives readers an immediate answer.
10 scales better when there are many news articles and related posts.
```

Best final structure:

```text
Hero:
  label, title, summary, date, reading time, source count

Quick answer:
  short direct answer for scanning

Article body:
  sections with clear headings

Right rail:
  source list, update history, related news

Bottom:
  related informational articles
```
