import type { readAffiliateMerchants } from "@/lib/admin/admin-section-data";
import { AdminTokenInput, TextInput } from "./AdminBaseForms";

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
