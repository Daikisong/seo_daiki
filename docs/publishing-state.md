# Publishing State

Public article routes separate publication state from indexing state.

## States

`publishStatus` controls whether a page may be publicly rendered:

```text
draft     -> hidden from public routes
pending   -> hidden from public routes
published -> public route may render
```

`indexStatus` controls whether a published page may be indexed:

```text
index           -> robots index, follow
noindex         -> robots noindex, follow
pending         -> robots noindex, follow
refresh_needed  -> robots noindex, follow
merge_candidate -> robots noindex, follow
```

For example, a published page with `indexStatus = pending` can be inspected by users, but search engines receive
`noindex, follow`.

## Preview Token

Draft and pending pages can be previewed only with a valid token:

```text
?previewToken=<PREVIEW_TOKEN>
```

Rules:

- `PREVIEW_TOKEN` must be set on the server.
- The query token must match exactly.
- Preview pages render with `robots: noindex, follow`.
- Normal published pages do not require a token.

## Static Params and Sitemaps

`generateStaticParams` includes only `publishStatus = published` articles.

Sitemaps include only:

```text
publishStatus = published
indexStatus = index
```

This means a draft review can exist in the database or sample data without being statically generated or listed in a
sitemap.

