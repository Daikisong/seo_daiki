import { briefLocaleTypeLabel, previewList } from "@/lib/admin/admin-content-workflow-model";
import { readContentBriefRows } from "@/lib/admin/admin-section-data";
import { AdminPanel, ContentBriefStatusForm, QueuePublishingJobForm } from "./AdminForms";

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
