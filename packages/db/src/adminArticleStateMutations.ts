import { prisma } from "./client";
import { articleStateGateBlockedAuditData } from "./adminMutationAuditPayloads";
import {
  normalizeArticleStateInput,
  type IndexStatusInput,
  type PublishStatusInput
} from "./adminMutationRules";
import { AdminPublishGateError } from "./adminPublishGateError";
import { evaluateArticleStateChange } from "./adminArticleStateGateEvaluation";
import {
  commitArticleStateUpdate,
  type ArticleStateUpdateTransaction
} from "./adminArticleStateUpdateTransaction";

export async function updateArticleState(input: {
  id: string;
  indexStatus?: IndexStatusInput;
  publishStatus?: PublishStatusInput;
  qualityScore?: number;
}) {
  const updateInput = normalizeArticleStateInput(input);
  const gate = await evaluateArticleStateChange(updateInput);
  if (!gate.ok) {
    await prisma.auditLog.create({
      data: articleStateGateBlockedAuditData({
        effective: updateInput,
        requested: input,
        before: gate.before,
        gateStatus: gate.gateStatus,
        gateScore: gate.gateScore,
        issues: gate.issues
      })
    });
    throw new AdminPublishGateError({
      articleId: updateInput.id,
      issues: gate.issues,
      gateStatus: gate.gateStatus,
      gateScore: gate.gateScore
    });
  }

  return prisma.$transaction((tx) =>
    commitArticleStateUpdate(tx as unknown as ArticleStateUpdateTransaction, updateInput)
  );
}
