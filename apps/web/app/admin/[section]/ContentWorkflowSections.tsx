import {
  briefLocaleTypeLabel,
  canRetryPublishingJob,
  contentWorkflowTrendFilters,
  previewList,
  publishingJobOutputLabel,
  topicIntentLabel,
  topicRowCountLabel,
  topicScoreBreakdownLabel,
  trendLocaleLabel,
  trendScoreLabel,
  type AdminSearchParams
} from "@/lib/admin/admin-content-workflow-model";
import {
  readContentBriefRows,
  readPublishingJobRows,
  readTopicRows,
  readTrendRows
} from "@/lib/admin/admin-section-data";
import {
  AdminPanel,
  ContentBriefStatusForm,
  PublishingJobRetryForm,
  QueuePublishingJobForm,
  TextInput,
  TopicStatusForm
} from "./AdminForms";

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

export async function TopicsSection() {
  const topics = await readTopicRows();
  return (
    <AdminPanel title="Topics">
      {topics.length === 0 ? (
        <p className="text-sm text-neutral-700">No topics are available. Run the trend cluster and score commands first.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Intent</th>
              <th>Score</th>
              <th>Breakdown</th>
              <th>Status</th>
              <th>Rows</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td>
                  <p className="font-semibold">{topic.canonicalTopic}</p>
                  <p className="text-xs text-neutral-500">{topic.slug}</p>
                </td>
                <td>{topicIntentLabel(topic)}</td>
                <td>{topic.score.toFixed(1)}</td>
                <td className="text-xs text-neutral-600">{topicScoreBreakdownLabel(topic.scoreBreakdown)}</td>
                <td>{topic.status}</td>
                <td className="text-sm">{topicRowCountLabel(topic)}</td>
                <td>
                  <div className="space-y-3">
                    {topic.dbBacked ? <TopicStatusForm topic={topic} /> : <span className="text-xs text-neutral-500">CSV export only</span>}
                    <QueuePublishingJobForm
                      jobType="generate_content_brief"
                      locale={topic.primaryLocale || "en"}
                      returnTo="/admin/topics/"
                      topicId={topic.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}

export async function BriefsSection() {
  const briefs = await readContentBriefRows();
  return (
    <AdminPanel title="Content briefs">
      {briefs.length === 0 ? (
        <p className="text-sm text-neutral-700">No content briefs are available. Run <code>python3 workers/python/cli.py generate-content-briefs</code>.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Brief</th>
              <th>Topic</th>
              <th>Intent</th>
              <th>Outline</th>
              <th>Evidence</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {briefs.map((brief) => (
              <tr key={brief.id}>
                <td>
                  <p className="font-semibold">{brief.titleCandidate}</p>
                  <p className="text-xs text-neutral-500">{briefLocaleTypeLabel(brief)}</p>
                </td>
                <td>{brief.topicLabel}</td>
                <td>{brief.searchIntent}</td>
                <td className="text-xs text-neutral-600">{previewList(brief.outline, 4)}</td>
                <td>{previewList(brief.requiredEvidence, 3)}</td>
                <td>{brief.status}</td>
                <td>
                  <div className="space-y-3">
                    {brief.dbBacked ? <ContentBriefStatusForm brief={brief} /> : <span className="text-xs text-neutral-500">JSON export only</span>}
                    <QueuePublishingJobForm
                      briefId={brief.id}
                      jobType="generate_topic_draft"
                      locale={brief.locale || "en"}
                      returnTo="/admin/briefs/"
                      topicId={brief.topicId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}

export async function PublishingJobsSection() {
  const jobs = await readPublishingJobRows();
  return (
    <AdminPanel title="Publishing jobs">
      {jobs.length === 0 ? (
        <p className="text-sm text-neutral-700">No publishing jobs are available. Generated JSON gate results are shown after <code>run-publishing-gate</code>.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Target</th>
              <th>Status</th>
              <th>Output</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <p className="font-semibold">{job.jobType}</p>
                  <p className="text-xs text-neutral-500">{job.locale}</p>
                </td>
                <td>{job.targetLabel}</td>
                <td>{job.status}</td>
                <td className="max-w-md text-sm text-neutral-700">{publishingJobOutputLabel(job)}</td>
                <td>{canRetryPublishingJob(job) ? <PublishingJobRetryForm jobId={job.id} /> : <span className="text-xs text-neutral-500">read only</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
