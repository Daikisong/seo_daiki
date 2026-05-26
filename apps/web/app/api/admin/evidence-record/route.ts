import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const locales = ["en", "es", "pt-br"] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const recordType = stringValue(formData.get("recordType"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/evidence/";

  try {
    const mutations = await import("@global-import-lab/db/admin-mutations");
    let updatedId = "";
    let action = "create";

    if (recordType === "product") {
      const canonicalName = required(formData, "canonicalName");
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertProduct({
          id: optional(formData, "id"),
          canonicalName,
          slug: required(formData, "slug"),
          category: required(formData, "category"),
          brandClaim: optional(formData, "brandClaim"),
          identityConfidence: optionalNumber(formData, "identityConfidence"),
          imageHash: optional(formData, "imageHash")
        })
      ).id;
    } else if (recordType === "variant") {
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertVariant({
          id: optional(formData, "id"),
          productId: required(formData, "productId"),
          optionName: required(formData, "optionName"),
          sourceUrl: required(formData, "sourceUrl"),
          sourceSku: optional(formData, "sourceSku"),
          wattageClaim: optionalInteger(formData, "wattageClaim"),
          plugType: optional(formData, "plugType"),
          cableIncluded: optionalBoolean(formData, "cableIncluded"),
          affiliateUrl: optional(formData, "affiliateUrl"),
          sellerName: optional(formData, "sellerName"),
          sellerId: optional(formData, "sellerId"),
          riskFlags: listValue(formData, "riskFlags")
        })
      ).id;
    } else if (recordType === "seller-claim") {
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertSellerClaim({
          id: optional(formData, "id"),
          productId: required(formData, "productId"),
          claimType: required(formData, "claimType"),
          claimValue: required(formData, "claimValue"),
          rawText: optional(formData, "rawText"),
          sourceUrl: optional(formData, "sourceUrl"),
          confidence: optionalNumber(formData, "confidence")
        })
      ).id;
    } else if (recordType === "verified-claim") {
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertVerifiedClaim({
          id: optional(formData, "id"),
          productId: required(formData, "productId"),
          testType: required(formData, "testType"),
          resultValue: required(formData, "resultValue"),
          unit: optional(formData, "unit"),
          method: required(formData, "method"),
          evidenceUrl: optional(formData, "evidenceUrl"),
          confidence: optionalNumber(formData, "confidence"),
          testedAt: optionalDate(formData, "testedAt")
        })
      ).id;
    } else if (recordType === "market-risk") {
      const locale = required(formData, "locale");
      if (!locales.includes(locale as (typeof locales)[number])) {
        return NextResponse.json({ error: `Invalid locale: ${locale}` }, { status: 400 });
      }
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertMarketRisk({
          id: optional(formData, "id"),
          productId: required(formData, "productId"),
          locale,
          country: optional(formData, "country"),
          plugRisk: optional(formData, "plugRisk"),
          customsRisk: optional(formData, "customsRisk"),
          certificationRisk: optional(formData, "certificationRisk"),
          returnRisk: optional(formData, "returnRisk"),
          localAlternativeNote: optional(formData, "localAlternativeNote"),
          score: optionalNumber(formData, "score")
        })
      ).id;
    } else if (recordType === "evidence-pack") {
      const locale = required(formData, "locale");
      if (!locales.includes(locale as (typeof locales)[number])) {
        return NextResponse.json({ error: `Invalid locale: ${locale}` }, { status: 400 });
      }
      action = optional(formData, "id") ? "update" : "create";
      updatedId = (
        await mutations.upsertEvidencePack({
          id: optional(formData, "id"),
          productId: optional(formData, "productId"),
          locale,
          packJson: parseJson(required(formData, "packJson"))
        })
      ).id;
    } else {
      return NextResponse.json({ error: `Unsupported recordType: ${recordType}` }, { status: 400 });
    }

    if (mutations.isAdminEntityType(recordType)) {
      await mutations.recordAuditLog({
        entityType: recordType,
        entityId: updatedId,
        action,
        actor: "admin",
        summary: `${action} ${recordType}.`
      });
    }

    return NextResponse.redirect(new URL(`${returnTo}?updated=${encodeURIComponent(updatedId)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin evidence mutation failed.";
    const status = message.includes("required") || message.includes("JSON") || message.includes("must be") ? 400 : 503;
    console.error("Admin evidence mutation failed.", error);
    return NextResponse.json(
      { error: status === 400 ? message : "Evidence record update failed. Check database connectivity." },
      { status }
    );
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function required(formData: FormData, name: string) {
  const value = stringValue(formData.get(name));
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function optional(formData: FormData, name: string) {
  return stringValue(formData.get(name)) || undefined;
}

function optionalNumber(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (raw === undefined) {
    return undefined;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be numeric.`);
  }
  return value;
}

function optionalInteger(formData: FormData, name: string) {
  const value = optionalNumber(formData, name);
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be an integer.`);
  }
  return value;
}

function optionalBoolean(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (raw === undefined) {
    return undefined;
  }
  if (["true", "yes", "1"].includes(raw.toLowerCase())) {
    return true;
  }
  if (["false", "no", "0"].includes(raw.toLowerCase())) {
    return false;
  }
  throw new Error(`${name} must be true or false.`);
}

function optionalDate(formData: FormData, name: string) {
  const raw = optional(formData, name);
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${name} must be a valid date.`);
  }
  return date;
}

function listValue(formData: FormData, name: string) {
  return stringValue(formData.get(name))
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`packJson must be valid JSON: ${error instanceof Error ? error.message : "parse failed"}`);
  }
}
