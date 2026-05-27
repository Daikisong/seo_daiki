import {
  canRetryPublishingJob,
  publishingJobOutputLabel
} from "@/lib/admin/admin-content-workflow-model";
import { readPublishingJobRows } from "@/lib/admin/admin-section-data";
import { AdminPanel, PublishingJobRetryForm } from "./AdminForms";

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
