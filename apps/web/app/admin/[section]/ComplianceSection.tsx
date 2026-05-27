import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import {
  articlePathLabel,
  articleStoredStatusLabel,
  healthComplianceLabel,
  issueListLabel
} from "@/lib/admin/admin-review-model";
import { readComplianceRows } from "@/lib/admin/admin-section-data";
import { AdminPanel } from "./AdminForms";

export async function ComplianceSection({
  articles,
  evidencePacks,
  products
}: {
  articles: Article[];
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  const rows = await readComplianceRows(articles, products, evidencePacks);
  return (
    <AdminPanel title="Compliance queue">
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-700">No compliance rows are available. Health, localization, unsafe redirect, and gate blockers appear here after validation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Status</th>
              <th>Health</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <p className="font-semibold">{row.title}</p>
                  <p className="text-xs text-neutral-500">{articlePathLabel(row)}</p>
                </td>
                <td>{articleStoredStatusLabel(row)}</td>
                <td>{healthComplianceLabel(row)}</td>
                <td>{issueListLabel(row.issues)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
