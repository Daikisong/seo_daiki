import {
  contentBriefStatuses,
  topicStatuses
} from "@/lib/admin/admin-section-config";
import { jobButtonLabel } from "@/lib/admin/admin-form-utils";
type StatusFormRow = {
  id: string;
  status: string;
};

export function TopicStatusForm({ topic }: { topic: StatusFormRow }) {
  return (
    <form action="/api/admin/topic-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={topic.id} />
      <input name="returnTo" type="hidden" value="/admin/topics/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={topic.status} name="status">
        {topicStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

export function ContentBriefStatusForm({ brief }: { brief: StatusFormRow }) {
  return (
    <form action="/api/admin/content-brief-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={brief.id} />
      <input name="returnTo" type="hidden" value="/admin/briefs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={brief.status} name="status">
        {contentBriefStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

export function PublishingJobRetryForm({ jobId }: { jobId: string }) {
  return (
    <form action="/api/admin/publishing-job-retry" className="grid min-w-48 gap-2" method="post">
      <input name="id" type="hidden" value={jobId} />
      <input name="returnTo" type="hidden" value="/admin/publishing-jobs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Retry</button>
    </form>
  );
}

export function QueuePublishingJobForm({
  articleId,
  briefId,
  file,
  groupId,
  jobType,
  locale,
  returnTo,
  topicId
}: {
  articleId?: string;
  briefId?: string;
  file?: string;
  groupId?: string;
  jobType: string;
  locale: string;
  returnTo: string;
  topicId?: string;
}) {
  return (
    <form action="/api/admin/publishing-job" className="grid min-w-52 gap-2" method="post">
      <input name="articleId" type="hidden" value={articleId ?? ""} />
      <input name="briefId" type="hidden" value={briefId ?? ""} />
      <input name="file" type="hidden" value={file ?? ""} />
      <input name="groupId" type="hidden" value={groupId ?? ""} />
      <input name="jobType" type="hidden" value={jobType} />
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="topicId" type="hidden" value={topicId ?? ""} />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        {jobButtonLabel(jobType)}
      </button>
    </form>
  );
}
