import type {
  readAffiliateMerchants,
  readAffiliateOffers
} from "@/lib/admin/admin-section-data";
import { AdminTokenInput, TextInput } from "./AdminBaseForms";

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
