import { articleStateUpdatedAuditData } from "./adminMutationAuditPayloads";
import type { ArticleStateInput } from "./adminMutationRules";

export interface ArticleStateUpdateTransaction {
  article: {
    findUnique(args: { where: { id: string } }): Promise<unknown>;
    update(args: {
      where: { id: string };
      data: {
        indexStatus?: ArticleStateInput["indexStatus"];
        publishStatus?: ArticleStateInput["publishStatus"];
        qualityScore?: number;
      };
      select: { id: true; indexStatus: true; publishStatus: true; qualityScore: true };
    }): Promise<{ id: string; indexStatus: string; publishStatus: string; qualityScore: number }>;
  };
  auditLog: {
    create(args: { data: ReturnType<typeof articleStateUpdatedAuditData> }): Promise<unknown>;
  };
}

export async function commitArticleStateUpdate(
  tx: ArticleStateUpdateTransaction,
  input: ArticleStateInput
) {
  const before = await tx.article.findUnique({ where: { id: input.id } });
  const row = await tx.article.update({
    where: { id: input.id },
    data: {
      indexStatus: input.indexStatus,
      publishStatus: input.publishStatus,
      qualityScore: input.qualityScore
    },
    select: { id: true, indexStatus: true, publishStatus: true, qualityScore: true }
  });

  await tx.auditLog.create({
    data: articleStateUpdatedAuditData({
      row,
      before,
      after: row
    })
  });

  return row;
}
