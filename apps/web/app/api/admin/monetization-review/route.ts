import { NextRequest, NextResponse } from "next/server";
import {
  isMonetizationReviewStatus,
  splitCandidateIds,
  updateMonetizationReviewPayload,
  type MonetizationReviewPayload
} from "@/lib/admin/admin-monetization-review-model";
import { verifyAdminRequest } from "@/lib/admin/auth";
import { readJsonFile, writeJsonFile } from "@/lib/server/json-file";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  const status = stringValue(formData.get("status"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/monetization-reviews/";
  const reviewerNotes = stringValue(formData.get("reviewerNotes"));
  const approvedCandidateIdsJson = splitCandidateIds(stringValue(formData.get("approvedCandidateIds")));
  const rejectedCandidateIdsJson = splitCandidateIds(stringValue(formData.get("rejectedCandidateIds")));

  if (!id) {
    return NextResponse.json({ error: "Monetization review id is required." }, { status: 400 });
  }
  if (!isMonetizationReviewStatus(status)) {
    return NextResponse.json({ error: `Invalid monetization review status: ${status}` }, { status: 400 });
  }

  try {
    const payload = readJsonFile<MonetizationReviewPayload>("data/exports/monetization_reviews.json", { reviews: [] });
    const updatedPayload = updateMonetizationReviewPayload(payload, {
      id,
      status,
      reviewerNotes,
      approvedCandidateIdsJson,
      rejectedCandidateIdsJson
    });
    writeJsonFile("data/exports/monetization_reviews.json", updatedPayload);
    return NextResponse.redirect(
      new URL(`${returnTo}?review=${encodeURIComponent(id)}&status=${encodeURIComponent(status)}`, request.url),
      303
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Monetization review update failed.";
    const statusCode = message.includes("was not found") ? 404 : 503;
    console.error("Monetization review update failed.", error);
    return NextResponse.json({ error: statusCode === 404 ? message : "Monetization review update failed." }, { status: statusCode });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
