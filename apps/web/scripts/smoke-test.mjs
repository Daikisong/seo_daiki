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
    "Buyer notes for fast-moving trends",
    "home should use the public site description",
  );
  assertIncludes(text, "Latest Briefs", "home should label content as Briefs");
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
  assertNotIncludes(
    text,
    "/garden-trends/",
    "sitemap must not include hidden categories",
  );
}

async function assertCategories() {
  await fetchText("/category/home-trends/");
  await fetchText("/category/electronics-trends/");
  await assertStatus("/category/garden-trends/", 404);
}

async function assertArticles() {
  const paths = [
    "/en/trends/europe-heatwave-portable-ac-trend-2026/",
    "/en/trends/travel-gan-charger-fake-wattage-trend/",
  ];

  for (const path of paths) {
    const text = await fetchText(path);
    assertIncludes(
      text,
      `${origin}${path}`,
      `${path} should include a self canonical URL`,
    );
    assertIncludes(text, "TrendBrief", `${path} should use the public brand`);
    assertIncludes(text, "Brief", `${path} should label the content unit`);
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

    if (path.includes("europe-heatwave-portable-ac")) {
      assertOrdered(
        text,
        [
          "Final Thoughts on the Best Portable AC and Cooling Picks",
          "Cooling products I would not treat as portable AC",
          "What portable AC can and cannot solve",
          "Cooling options to compare first",
          "Before you buy",
        ],
        `${path} should keep supporting clarification sections after final thoughts`,
      );
    }
  }
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
