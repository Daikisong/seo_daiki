import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const allowedJobTypes = [
  "import_trend_signals",
  "generate_content_brief",
  "generate_topic_draft",
  "localize_topic_draft",
  "sync_hreflang_group",
  "validate",
  "refresh"
] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const jobType = stringValue(formData.get("jobType"));
  const locale = stringValue(formData.get("locale")) || "en";
  if (!allowedJobTypes.includes(jobType as (typeof allowedJobTypes)[number])) {
    return NextResponse.json({ error: `Invalid publishing job type: ${jobType}` }, { status: 400 });
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    const row = await operations.createPublishingJob({
      topicId: stringValue(formData.get("topicId")) || undefined,
      articleId: stringValue(formData.get("articleId")) || undefined,
      locale,
      jobType,
      inputJson: inputPayload(formData),
      actor: "admin"
    });
    const returnTo = safeReturnTo(stringValue(formData.get("returnTo")));
    const redirectUrl = new URL(returnTo, request.url);
    redirectUrl.searchParams.set("job", row.id);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("Publishing job creation failed.", error);
    return NextResponse.json({ error: "Publishing job creation failed. Check database connectivity." }, { status: 503 });
  }
}

function inputPayload(formData: FormData) {
  const rawJson = stringValue(formData.get("inputJson"));
  if (rawJson) {
    try {
      return JSON.parse(rawJson) as unknown;
    } catch {
      return { raw: rawJson };
    }
  }

  return {
    file: stringValue(formData.get("file")) || undefined,
    briefId: stringValue(formData.get("briefId")) || undefined,
    groupId: stringValue(formData.get("groupId")) || undefined
  };
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnTo(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin/publishing-jobs/";
  }
  return value;
}
