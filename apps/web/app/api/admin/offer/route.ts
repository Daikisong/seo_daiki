import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const merchantId = stringValue(formData.get("merchantId"));
  const title = stringValue(formData.get("title"));
  const url = stringValue(formData.get("url"));
  const affiliateUrl = stringValue(formData.get("affiliateUrl"));
  const category = stringValue(formData.get("category"));

  if (!merchantId || !title || !url || !affiliateUrl || !category) {
    return NextResponse.json({ error: "merchantId, title, url, affiliateUrl, and category are required." }, { status: 400 });
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    const row = await operations.upsertOffer({
      id: stringValue(formData.get("id")) || undefined,
      merchantId,
      programId: stringValue(formData.get("programId")) || undefined,
      productId: stringValue(formData.get("productId")) || undefined,
      topicId: stringValue(formData.get("topicId")) || undefined,
      title,
      description: stringValue(formData.get("description")) || undefined,
      url,
      affiliateUrl,
      price: stringValue(formData.get("price")) || undefined,
      currency: stringValue(formData.get("currency")) || undefined,
      locale: stringValue(formData.get("locale")) || undefined,
      country: stringValue(formData.get("country")) || undefined,
      category,
      evidenceLevel: stringValue(formData.get("evidenceLevel")) || "merchant_claim",
      healthSensitive: stringValue(formData.get("healthSensitive")) === "true",
      lastCheckedAt: stringValue(formData.get("lastCheckedAt")) || undefined,
      status: stringValue(formData.get("status")) || "active"
    });
    const returnTo = stringValue(formData.get("returnTo")) || "/admin/offers/";
    return NextResponse.redirect(new URL(`${returnTo}?offer=${encodeURIComponent(row.id)}`, request.url), 303);
  } catch (error) {
    console.error("Offer admin mutation failed.", error);
    return NextResponse.json({ error: "Offer update failed. Check database connectivity." }, { status: 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
