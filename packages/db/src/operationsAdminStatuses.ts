export const topicStatuses = ["candidate", "briefed", "drafted", "published", "rejected"] as const;
export const contentBriefStatuses = ["draft", "approved", "rejected", "converted"] as const;
export const publishingJobStatuses = ["queued", "running", "done", "failed", "blocked"] as const;

export type TopicStatus = (typeof topicStatuses)[number];
export type ContentBriefStatus = (typeof contentBriefStatuses)[number];
export type PublishingJobStatus = (typeof publishingJobStatuses)[number];
