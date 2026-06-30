# TrendBrief Logo Assets

Use SVG in the header whenever possible. The SVG files are transparent, have no background image, and no glow.

Recommended header usage for light backgrounds:

```tsx
import Image from "next/image";

export function SiteLogo() {
  return (
    <Image
      src="/brand/trendbrief-logo-main.png"
      alt="TrendBrief"
      width={260}
      height={60}
      priority
      className="h-9 w-auto object-contain"
    />
  );
}
```

Do not use the logo as a `background-image` with `cover` or crop it inside a fixed box.
Use `object-contain`, fixed intrinsic width/height, and transparent SVG/PNG.

Suggested CSS:

```css
.site-logo {
  display: block;
  width: auto;
  height: 36px;
  object-fit: contain;
}

@media (min-width: 768px) {
  .site-logo {
    height: 40px;
  }
}
```

Files:

- trendbrief-logo-main.png: provided transparent header logo
- trendbrief-logo-light.svg: fallback light header / white background
- trendbrief-logo-dark.svg: dark header
- trendbrief-icon.svg: favicon/app icon base
- PNG exports are included for fallback only.
