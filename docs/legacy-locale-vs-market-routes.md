# Legacy Locale Routes vs Market Routes

There are two route families during the transition.

## New Market Routes

New trend-first content uses market and language:

```text
/us/en/
/es/es/
/br/pt-br/
/kr/ko/
```

New test posts and research pages must stay under this structure.

Example:

```text
/us/en/posts/magnesium-sleep/
```

## Legacy Locale Routes

Legacy locale entry points still redirect:

```text
/en    -> /us/en/
/es    -> /es/es/
/pt-br -> /br/pt-br/
```

Some older product evidence article routes may still use locale-only URLs such as:

```text
/en/guides/...
/es/resenas/...
/pt-br/analises/...
```

They are treated as legacy product-lab surfaces until migrated.

## Boundary Rule

Do not create new trend-first articles under legacy locale-only paths.

Use:

```text
/[market]/[language]/...
```

for the trend desk, SERP intelligence, briefs, calendars, test posts, and future promoted public articles.

Long term, product evidence routes should also move to market-aware paths.
