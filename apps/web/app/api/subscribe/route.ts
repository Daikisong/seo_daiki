import { mkdir, readFile, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { join } from "node:path";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const market = typeof body?.market === "string" ? body.market.trim().toLowerCase() : "";
  const language = typeof body?.language === "string" ? body.language.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email) || !market || !language) {
    return NextResponse.json({ ok: false, error: "invalid_subscription_request" }, { status: 400 });
  }

  const root = process.cwd().replace(/\/apps\/web$/, "");
  const dir = join(root, "data", "exports");
  const file = join(dir, "subscribers.json");
  await mkdir(dir, { recursive: true });
  const existing = await readSubscribers(file);
  const subscribers = existing.filter(
    (item) => !(item.email === email && item.market === market && item.language === language)
  );
  subscribers.push({ email, market, language, createdAt: new Date().toISOString(), source: "market_subscribe_form" });
  await writeFile(file, `${JSON.stringify({ subscribers }, null, 2)}\n`);
  return NextResponse.json({ ok: true });
}

async function readSubscribers(file: string): Promise<Array<{ email: string; market: string; language: string; createdAt: string; source: string }>> {
  try {
    const payload = JSON.parse(await readFile(file, "utf8")) as { subscribers?: unknown[] };
    return (payload.subscribers ?? []).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Record<string, unknown>;
      if (typeof row.email !== "string" || typeof row.market !== "string" || typeof row.language !== "string") return [];
      return [
        {
          email: row.email,
          market: row.market,
          language: row.language,
          createdAt: typeof row.createdAt === "string" ? row.createdAt : "",
          source: typeof row.source === "string" ? row.source : "market_subscribe_form"
        }
      ];
    });
  } catch {
    return [];
  }
}
