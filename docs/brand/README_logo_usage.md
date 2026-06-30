# TrendBrief Logo Assets

Use the transparent logo asset in the header with `object-contain`.

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

Do not use the logo as a `background-image` with `cover`, and do not crop it
inside a fixed box. Use `object-contain`, fixed intrinsic width/height, and the
transparent PNG/SVG source.
