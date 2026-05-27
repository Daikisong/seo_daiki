export function samplePlanFailures(plannedUrlTotal: number, indexableCount: number) {
  const failures: string[] = [];
  if (plannedUrlTotal !== 110) {
    failures.push(`Initial URL plan should generate 110 URLs, but generated ${plannedUrlTotal}.`);
  }

  if (indexableCount < 40 || indexableCount > 80) {
    failures.push(`Initial index selection should stay between 40 and 80 pages after trend-route expansion, but found ${indexableCount}.`);
  }
  return failures;
}
