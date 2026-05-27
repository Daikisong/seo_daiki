import type {
  readAffiliateMerchants,
  readAffiliateOffers
} from "@/lib/admin/admin-section-data";
import { AdminTokenInput, TextInput } from "./AdminBaseForms";

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
