import {
  contentWorkflowTrendFilters,
  trendLocaleLabel,
  trendScoreLabel,
  type AdminSearchParams
} from "@/lib/admin/admin-content-workflow-model";
import { readTrendRows } from "@/lib/admin/admin-section-data";
import { AdminPanel, QueuePublishingJobForm, TextInput } from "./AdminForms";

export async function TrendsSection({ filters }: { filters: AdminSearchParams }) {
  const trendFilters = contentWorkflowTrendFilters(filters);
  const trends = await readTrendRows(trendFilters);

  return (
    <div className="space-y-8">
      <AdminPanel title="Import trend CSV">
        <QueuePublishingJobForm
          file="data/seeds/trend-signals.csv"
          jobType="import_trend_signals"
          locale={trendFilters.locale || "en"}
          returnTo="/admin/trends/"
        />
      </AdminPanel>
      <AdminPanel title="Trend filters">
        <form className="grid gap-2 md:grid-cols-4" method="get">
          <TextInput defaultValue={trendFilters.locale} label="Locale" name="locale" />
          <TextInput defaultValue={trendFilters.country} label="Country" name="country" />
          <TextInput defaultValue={trendFilters.source} label="Source" name="source" />
          <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Apply filters</button>
        </form>
      </AdminPanel>
      <AdminPanel title="Trend signals">
        {trends.length === 0 ? (
          <p className="text-sm text-neutral-700">No trend signals are available. Run <code>python3 workers/python/cli.py import-trend-signals</code> or connect Postgres.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Signal</th>
                <th>Locale</th>
                <th>Scores</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr key={trend.id}>
                  <td>
                    <p className="font-semibold">{trend.query}</p>
                    <p className="text-xs text-neutral-500">{trend.topicRaw}</p>
                  </td>
                  <td>{trendLocaleLabel(trend)}</td>
                  <td className="text-sm">{trendScoreLabel(trend)}</td>
                  <td>{trend.sourceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    </div>
  );
}
