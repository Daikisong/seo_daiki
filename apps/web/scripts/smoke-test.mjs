import { spawn } from "node:child_process";

const port = Number(process.env.SMOKE_PORT ?? 3101);
const origin = `http://localhost:${port}`;
const nextBin = process.platform === "win32" ? "next.cmd" : "next";

const server = spawn(nextBin, ["start", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: origin },
  stdio: ["ignore", "pipe", "pipe"],
  shell: process.platform === "win32",
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer(origin);
  await assertHomeBranding();
  await assertSitemap();
  await assertCategories();
  await assertArticles();
  await assertAuthors();
  await assertPlannedLocale404();
  console.log("Smoke checks passed.");
} finally {
  await stopServer();
}

async function waitForServer(url) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until Next is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Smoke server did not start at ${url}.\n${serverOutput}`);
}

async function assertHomeBranding() {
  const text = await fetchText("/");
  assertIncludes(text, "TrendBrief", "home should use the public brand");
  assertIncludes(
    text,
    "trendbrief-logo-main.png",
    "home should render the provided header logo asset",
  );
  assertIncludes(
    text,
    "/brand/trendbrief-icon.svg",
    "home metadata should use the brand icon",
  );
  assertIncludes(
    text,
    "Buyer notes for fast-moving trends",
    "home should use the public site description",
  );
  assertIncludes(text, "Latest Briefs", "home should label content as Briefs");
  assertIncludes(
    text,
    "What to buy",
    "home should expose the shopping magazine navigation section",
  );
  assertIncludes(
    text,
    "brief-title-link",
    "home article titles should keep the colored underline title style",
  );
  assertNotIncludes(
    text,
    "TREND - Jacob",
    "home must not show the old public brand",
  );
  assertNotIncludes(
    text,
    "latest-posts",
    "home must not use the old latest-posts anchor",
  );
  for (const emptyCategoryLabel of [
    "Garden Briefs",
    "Auto Briefs",
    "Outdoor Briefs",
    "Tool Briefs",
    "Electronics Briefs",
    "Personal Mobility Briefs",
  ]) {
    assertNotIncludes(
      text,
      emptyCategoryLabel,
      `home navigation must not expose empty category ${emptyCategoryLabel}`,
    );
  }
}

async function assertSitemap() {
  const text = await fetchText("/sitemap.xml");
  assertIncludes(
    text,
    "/en/trends/",
    "sitemap should include indexable English trend articles",
  );
  assertNotIncludes(
    text,
    "/de-de/",
    "sitemap must not include planned locale URLs",
  );
  assertIncludes(
    text,
    "/category/home-trends/",
    "sitemap should include category routes only after they have indexable briefs",
  );
  assertNotIncludes(
    text,
    "/garden-trends/",
    "sitemap must not include empty planned category routes",
  );
}

async function assertCategories() {
  await fetchText("/category/home-trends/");
  await assertNoindexCategory("/category/garden-trends/");
  await assertNoindexCategory("/category/auto-trends/");
  await assertNoindexCategory("/category/outdoor-trends/");
  await assertNoindexCategory("/category/tool-trends/");
  await assertNoindexCategory("/category/electronics-trends/");
  await assertNoindexCategory("/category/personal-mobility-trends/");
}

async function assertNoindexCategory(path) {
  const text = await fetchText(path);
  assertIncludes(
    text,
    "noindex",
    `${path} should remain noindex until real briefs are published`,
  );
}

async function assertArticles() {
  const paths = ["/en/trends/europe-heatwave-portable-ac-trend-2026/"];

  for (const path of paths) {
    const text = await fetchText(path);
    assertIncludes(
      text,
      `${origin}${path}`,
      `${path} should include a self canonical URL`,
    );
    assertIncludes(text, "TrendBrief", `${path} should use the public brand`);
    assertIncludes(text, "Brief", `${path} should label the content unit`);
    assertIncludes(text, "hero image", `${path} should render a hero image`);
    assertIncludes(
      text,
      "reader-emphasis",
      `${path} should render LLM/editor emphasis as colored underline markup`,
    );
    assertNotIncludes(
      text,
      "TREND - Jacob",
      `${path} must not show the old public brand`,
    );
    assertNotIncludes(
      text,
      "Buyer decision guide",
      `${path} must not use the old guide label`,
    );
    assertMatches(text, /Check price/, `${path} should render outbound CTAs`);
    assertNotMatches(
      text,
      /Search current listings|View product page|Watch first|Checked before listing|Spec snapshot|Review pattern:|Price route/i,
      `${path} must not render internal-looking CTA or evidence labels`,
    );
    assertNotIncludes(
      text,
      "/api/affiliate-click",
      `${path} must not depend on the affiliate-click API for navigation`,
    );
    assertIncludes(
      text,
      'rel="sponsored nofollow noopener noreferrer"',
      `${path} source-stack price checks should keep sponsored outbound rel`,
    );
    assertNotIncludes(
      text,
      'href="/out',
      `${path} must not render internal redirect hrefs`,
    );
    assertNotMatches(
      text,
      /SERP provider|Search Console|LLM signals|Commercial search intent|Evidence fit|Monetization link available|ranked products by|evidence quality|source stack|evidence note|recommendation strength/i,
      `${path} must not expose internal workflow language`,
    );
    assertNotMatches(
      text,
      /we did not test|we didn't test|not a lab|not a testing lab|not tested in (?:a|our|the) lab|not directly tested|not a full-time product testing|we tested|our tester|tried and tested|our expert review|in-house product testing/i,
      `${path} must not use defensive not-tested copy as public trust text`,
    );
    for (const expectedArticleModule of [
      "The quick list",
      "Where to check by country",
      "Editor's verdict",
      "Specifications",
      "Today's best route",
      "Reasons to buy",
      "Reasons to avoid",
      "Source review",
      "Marketplace review signal",
    ]) {
      assertIncludes(
        text,
        expectedArticleModule,
        `${path} should render ${expectedArticleModule}`,
      );
    }
    assertNotIncludes(
      text,
      "Reasons to skip",
      `${path} should use reader-facing Reasons to avoid wording`,
    );

    if (path.includes("europe-heatwave-portable-ac")) {
      assertIncludes(
        text,
        "europe-heatwave-portable-ac-hero.png",
        `${path} should use the heatwave-specific hero image`,
      );
      assertOrdered(
        text,
        [
          "europe-heatwave-portable-ac-hero.png",
          "Jump to",
          'id="recent-update"',
          'id="trend-signal"',
        ],
        `${path} should keep hero before jump nav, then recent update and trend signal`,
      );
      assertOrdered(
        text,
        ['id="country-buying-routes"', 'id="quick-list"'],
        `${path} should show buying routes before the quick product list`,
      );
      assertOrdered(
        text,
        ['id="quick-list"', 'id="top-10-reviews"', 'id="top-10-comparison"'],
        `${path} should render quick list, product notes, then comparison table`,
      );
      assertOrdered(
        text,
        [
          "Final Thoughts on the Best Portable AC and Cooling Picks",
          "Cooling products I would not treat as portable AC",
          "What portable AC can and cannot solve",
          "Cooling options to compare first",
          "Before you buy",
          'id="faq"',
          'id="update-log"',
          'id="about-author"',
        ],
        `${path} should keep supporting clarification sections after final thoughts and before FAQ/update/author`,
      );
    }
  }

  await assertStatus("/en/trends/travel-gan-charger-fake-wattage-trend/", 404);
}

async function assertAuthors() {
  const jacob = await fetchText("/authors/jacob/");
  assertIncludes(jacob, "Jacob", "Jacob author page should render");
  assertIncludes(
    jacob,
    "Marketplace Research Editor",
    "Jacob author page should show the public role",
  );
  assertMatches(
    jacob,
    /Latest[\s\S]*Briefs[\s\S]*by[\s\S]*Jacob/,
    "Jacob author page should render the author article list",
  );

  const editors = await fetchText("/authors/trendbrief-editors/");
  assertIncludes(
    editors,
    "TrendBrief Editors",
    "TrendBrief Editors author page should render",
  );
  assertIncludes(
    editors,
    "Editorial Desk",
    "TrendBrief Editors page should show the public role",
  );
  assertMatches(
    editors,
    /Latest[\s\S]*Briefs[\s\S]*by[\s\S]*TrendBrief Editors/,
    "TrendBrief Editors page should render the author article list",
  );
}

async function assertPlannedLocale404() {
  await assertStatus("/de-de/trends/hitzewelle-mobile-klimaanlage-2026/", 404);
}

async function fetchText(path) {
  const response = await fetch(`${origin}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.text();
}

async function assertStatus(path, expectedStatus) {
  const response = await fetch(`${origin}${path}`, { redirect: "manual" });
  if (response.status !== expectedStatus) {
    throw new Error(
      `${path} returned ${response.status}, expected ${expectedStatus}`,
    );
  }
}

function assertIncludes(value, expected, message) {
  if (!value.includes(expected)) {
    throw new Error(message);
  }
}

function assertNotIncludes(value, expected, message) {
  if (value.includes(expected)) {
    throw new Error(message);
  }
}

function assertMatches(value, pattern, message) {
  if (!pattern.test(value)) {
    throw new Error(message);
  }
}

function assertNotMatches(value, pattern, message) {
  if (pattern.test(value)) {
    throw new Error(message);
  }
}

function assertOrdered(value, expectedItems, message) {
  let previousIndex = -1;
  for (const expected of expectedItems) {
    const nextIndex = value.indexOf(expected);
    if (nextIndex === -1 || nextIndex <= previousIndex) {
      throw new Error(`${message}: expected "${expected}" after previous item`);
    }
    previousIndex = nextIndex;
  }
}

async function stopServer() {
  if (!server.pid || server.killed) {
    return;
  }

  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn(
        "taskkill",
        ["/pid", String(server.pid), "/T", "/F"],
        {
          stdio: "ignore",
        },
      );
      killer.on("close", resolve);
      killer.on("error", resolve);
    });
    return;
  }

  server.kill("SIGTERM");
}
