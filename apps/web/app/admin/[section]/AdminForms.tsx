import type { ReactNode } from "react";
import {
  contentBriefStatuses,
  refreshSuggestionStatuses,
  topicStatuses
} from "@/lib/admin/admin-section-config";
import {
  adminFieldValue,
  jobButtonLabel
} from "@/lib/admin/admin-form-utils";
import {
  readAffiliateMerchants,
  readAffiliateOffers,
  readContentBriefRows,
  readPersistedRefreshSuggestions,
  readTopicRows
} from "@/lib/admin/admin-section-data";

export type AdminRecordEntityType =
  | "product"
  | "variant"
  | "seller-claim"
  | "verified-claim"
  | "market-risk"
  | "evidence-pack"
  | "article";

export function AdminPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function QualityStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function AdminTokenInput() {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Admin token</span>
      <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
    </label>
  );
}

export function TextInput({
  defaultValue,
  label,
  name,
  required = false,
  type = "text"
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  const inputProps = {
    ...(required ? { required: true } : {}),
    ...(type === "number" ? { step: "any" } : {})
  };

  return (
    <label className="text-sm">
      <span className="block text-neutral-600">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
        defaultValue={adminFieldValue(defaultValue)}
        name={name}
        type={type}
        {...inputProps}
      />
    </label>
  );
}

export function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
      {label}
    </button>
  );
}

export function RecordActionForm({
  entityId,
  entityType,
  returnTo
}: {
  entityId: string;
  entityType: AdminRecordEntityType;
  returnTo: string;
}) {
  return (
    <form action="/api/admin/record-action" className="grid min-w-52 gap-2" method="post">
      <input name="entityType" type="hidden" value={entityType} />
      <input name="entityId" type="hidden" value={entityId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-neutral-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="archive">
          Archive
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="delete">
          Delete
        </button>
      </div>
    </form>
  );
}

export function RefreshSuggestionStatusForm({
  suggestion
}: {
  suggestion: Awaited<ReturnType<typeof readPersistedRefreshSuggestions>>[number];
}) {
  return (
    <form action="/api/admin/refresh-suggestion-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={suggestion.id} />
      <input name="returnTo" type="hidden" value="/admin/search-console/" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <select
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        defaultValue={suggestion.status}
        name="status"
      >
        {refreshSuggestionStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        Save status
      </button>
    </form>
  );
}

export function PlacementStatusForm({ placementId, returnTo }: { placementId: string; returnTo: string }) {
  return (
    <form action="/api/admin/affiliate-placement-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={placementId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="disclosureShown" type="hidden" value="true" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="approved">
          Approve
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="rejected">
          Reject
        </button>
      </div>
    </form>
  );
}

export function TopicStatusForm({ topic }: { topic: Awaited<ReturnType<typeof readTopicRows>>[number] }) {
  return (
    <form action="/api/admin/topic-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={topic.id} />
      <input name="returnTo" type="hidden" value="/admin/topics/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={topic.status} name="status">
        {topicStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

export function ContentBriefStatusForm({ brief }: { brief: Awaited<ReturnType<typeof readContentBriefRows>>[number] }) {
  return (
    <form action="/api/admin/content-brief-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={brief.id} />
      <input name="returnTo" type="hidden" value="/admin/briefs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={brief.status} name="status">
        {contentBriefStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

export function PublishingJobRetryForm({ jobId }: { jobId: string }) {
  return (
    <form action="/api/admin/publishing-job-retry" className="grid min-w-48 gap-2" method="post">
      <input name="id" type="hidden" value={jobId} />
      <input name="returnTo" type="hidden" value="/admin/publishing-jobs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Retry</button>
    </form>
  );
}

export function QueuePublishingJobForm({
  articleId,
  briefId,
  file,
  groupId,
  jobType,
  locale,
  returnTo,
  topicId
}: {
  articleId?: string;
  briefId?: string;
  file?: string;
  groupId?: string;
  jobType: string;
  locale: string;
  returnTo: string;
  topicId?: string;
}) {
  return (
    <form action="/api/admin/publishing-job" className="grid min-w-52 gap-2" method="post">
      <input name="articleId" type="hidden" value={articleId ?? ""} />
      <input name="briefId" type="hidden" value={briefId ?? ""} />
      <input name="file" type="hidden" value={file ?? ""} />
      <input name="groupId" type="hidden" value={groupId ?? ""} />
      <input name="jobType" type="hidden" value={jobType} />
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="topicId" type="hidden" value={topicId ?? ""} />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        {jobButtonLabel(jobType)}
      </button>
    </form>
  );
}

export function MerchantForm({ merchant }: { merchant?: Awaited<ReturnType<typeof readAffiliateMerchants>>[number] }) {
  return (
    <form action="/api/admin/merchant" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="id" type="hidden" value={merchant?.id ?? ""} />
      <input name="returnTo" type="hidden" value="/admin/merchants/" />
      <AdminTokenInput />
      <TextInput defaultValue={merchant?.name} label="Name" name="name" required />
      <TextInput defaultValue={merchant?.slug} label="Slug" name="slug" required />
      <TextInput defaultValue={merchant?.domain} label="Domain" name="domain" required />
      <TextInput defaultValue={merchant?.merchantType ?? "retailer"} label="Type" name="merchantType" required />
      <TextInput defaultValue={merchant?.allowedDomains.join(", ")} label="Allowed domains" name="allowedDomains" required />
      <TextInput defaultValue={merchant?.defaultRel ?? "sponsored nofollow"} label="Default rel" name="defaultRel" required />
      <label className="text-sm">
        <span className="block text-neutral-600">Health sensitive</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={merchant?.healthSensitive ? "true" : "false"} name="healthSensitive">
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block text-neutral-600">Enabled</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={merchant?.enabled === false ? "false" : "true"} name="enabled">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">
        Save merchant
      </button>
    </form>
  );
}

export function OfferForm({
  merchants,
  offer
}: {
  merchants: Awaited<ReturnType<typeof readAffiliateMerchants>>;
  offer?: Awaited<ReturnType<typeof readAffiliateOffers>>[number];
}) {
  return (
    <form action="/api/admin/offer" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="id" type="hidden" value={offer?.id ?? ""} />
      <input name="returnTo" type="hidden" value="/admin/offers/" />
      <AdminTokenInput />
      <label className="text-sm">
        <span className="block text-neutral-600">Merchant</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.merchantId ?? ""} name="merchantId" required>
          <option value="">Select merchant</option>
          {merchants.map((merchant) => (
            <option key={merchant.id} value={merchant.id}>{merchant.slug}</option>
          ))}
        </select>
      </label>
      <TextInput defaultValue={offer?.title} label="Title" name="title" required />
      <TextInput defaultValue={offer?.category ?? "general"} label="Category" name="category" required />
      <TextInput defaultValue={offer?.url} label="URL" name="url" required />
      <TextInput defaultValue={offer?.affiliateUrl} label="Affiliate URL" name="affiliateUrl" required />
      <TextInput defaultValue={offer?.locale ?? ""} label="Locale" name="locale" />
      <TextInput defaultValue={offer?.country ?? ""} label="Country" name="country" />
      <TextInput defaultValue={offer?.price ?? ""} label="Price" name="price" type="number" />
      <TextInput defaultValue={offer?.currency ?? ""} label="Currency" name="currency" />
      <TextInput defaultValue={offer?.evidenceLevel ?? "merchant_claim"} label="Evidence level" name="evidenceLevel" />
      <TextInput defaultValue={offer?.status ?? "active"} label="Status" name="status" />
      <TextInput defaultValue={offer?.lastCheckedAt ?? ""} label="Last checked" name="lastCheckedAt" type="date" />
      <label className="text-sm">
        <span className="block text-neutral-600">Health sensitive</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.healthSensitive ? "true" : "false"} name="healthSensitive">
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Description</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.description ?? ""} name="description" />
      </label>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">
        Save offer
      </button>
    </form>
  );
}
