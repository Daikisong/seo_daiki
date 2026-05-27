import {
  type AdminMutations,
  evidenceRecordMutationAction,
  evidenceRecordMutationHandler
} from "./evidence-record-route-handlers";

export async function applyEvidenceRecordMutation(
  recordType: string,
  formData: FormData,
  mutations: AdminMutations
) {
  const action = evidenceRecordMutationAction(formData);
  const updatedId = await evidenceRecordMutationHandler(recordType)(formData, mutations);

  return { action, updatedId };
}
