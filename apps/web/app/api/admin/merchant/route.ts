import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const name = stringValue(formData.get("name"));
  const slug = stringValue(formData.get("slug"));
  const domain = stringValue(formData.get("domain"));
  const merchantType = stringValue(formData.get("merchantType"));

  if (!name || !slug || !domain || !merchantType) {
    return NextResponse.json({ error: "name, slug, domain, and merchantType are required." }, { status: 400 });
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    const row = await operations.upsertMerchant({
      id: stringValue(formData.get("id")) || undefined,
      name,
      slug,
      domain,
      merchantType,
      allowedDomains: csvList(formData.get("allowedDomains")),
      defaultRel: stringValue(formData.get("defaultRel")) || "sponsored nofollow",
      healthSensitive: stringValue(formData.get("healthSensitive")) === "true",
      enabled: stringValue(formData.get("enabled")) !== "false"
    });
    const returnTo = stringValue(formData.get("returnTo")) || "/admin/merchants/";
    return NextResponse.redirect(new URL(`${returnTo}?merchant=${encodeURIComponent(row.id)}`, request.url), 303);
  } catch (error) {
    console.error("Merchant admin mutation failed.", error);
    return NextResponse.json({ error: "Merchant update failed. Check database connectivity." }, { status: 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function csvList(value: FormDataEntryValue | null) {
  return stringValue(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
