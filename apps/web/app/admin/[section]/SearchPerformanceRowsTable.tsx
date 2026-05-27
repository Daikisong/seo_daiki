import {
  formatSearchConsoleCtr,
  formatSearchConsolePosition,
  searchConsoleRowKey
} from "@/lib/admin/admin-search-console-model";
import type { SearchConsoleRow } from "@/lib/admin/search-console-report";
import { AdminPanel } from "./AdminForms";

export function SearchPerformanceRowsTable({ rows }: { rows: SearchConsoleRow[] }) {
  return (
    <AdminPanel title="Search performance rows">
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Query</th>
            <th>Country</th>
            <th>Device</th>
            <th>Clicks</th>
            <th>Impressions</th>
            <th>CTR</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={searchConsoleRowKey(row)}>
              <td>{row.page}</td>
              <td>{row.query}</td>
              <td>{row.country ?? "-"}</td>
              <td>{row.device ?? "-"}</td>
              <td>{row.clicks}</td>
              <td>{row.impressions}</td>
              <td>{formatSearchConsoleCtr(row.ctr)}</td>
              <td>{formatSearchConsolePosition(row.position)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPanel>
  );
}
