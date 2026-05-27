import {
  listValue,
  optional,
  optionalBoolean,
  optionalDate,
  optionalInteger,
  optionalNumber,
  parseJson,
  required,
  requiredLocale
} from "./evidence-record-form-values";

type AdminMutations = typeof import("@global-import-lab/db/admin-mutations");

export async function applyEvidenceRecordMutation(
  recordType: string,
  formData: FormData,
  mutations: AdminMutations
) {
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
    const locale = requiredLocale(formData);
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
    const locale = requiredLocale(formData);
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
    throw new Error(`Unsupported recordType: ${recordType}`);
  }

  return { action, updatedId };
}
