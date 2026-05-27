import {
  localizationDepthLabel,
  localizationPrimaryLocale,
  localizationVariantStatusLabel
} from "@/lib/admin/admin-review-model";
import { readLocalizationRows } from "@/lib/admin/admin-section-data";
import { AdminPanel, QueuePublishingJobForm } from "./AdminForms";

export async function LocalizationSection() {
  const rows = await readLocalizationRows();
  return (
    <AdminPanel title="Localization">
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-700">No localization groups or localized draft exports are available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Source</th>
              <th>Variants</th>
              <th>Depth</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <p className="font-semibold">{row.topicLabel}</p>
                  <p className="text-xs text-neutral-500">{row.id}</p>
                </td>
                <td>{row.sourceLabel}</td>
                <td>{localizationVariantStatusLabel(row.variants)}</td>
                <td>{localizationDepthLabel(row.variants)}</td>
                <td>
                  <QueuePublishingJobForm
                    groupId={row.id}
                    jobType="sync_hreflang_group"
                    locale={localizationPrimaryLocale(row.variants)}
                    returnTo="/admin/localization/"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
