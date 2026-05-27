import {
  topicIntentLabel,
  topicRowCountLabel,
  topicScoreBreakdownLabel
} from "@/lib/admin/admin-content-workflow-model";
import { readTopicRows } from "@/lib/admin/admin-section-data";
import { AdminPanel, QueuePublishingJobForm, TopicStatusForm } from "./AdminForms";

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
