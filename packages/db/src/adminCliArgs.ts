export function parseAdminCliArgs(argv: string[]) {
  const [command, ...args] = argv[0] === "--" ? argv.slice(1) : argv;
  return { command, args };
}

export function indexStatusUsage() {
  return "Usage: pnpm db:admin -- set-index-status <articleId> <index|noindex|pending|refresh_needed|merge_candidate>";
}

export function refreshSuggestionListUsage(statuses: readonly string[]) {
  return `Usage: pnpm db:admin -- list-refresh-suggestions [${statuses.join("|")}] [limit]`;
}

export function refreshSuggestionStatusUsage(statuses: readonly string[]) {
  return `Usage: pnpm db:admin -- set-refresh-suggestion-status <suggestionId> <${statuses.join("|")}>`;
}

export function recordActionUsage(command: string) {
  return `Usage: pnpm db:admin -- ${command} <product|variant|seller-claim|verified-claim|market-risk|evidence-pack|article> <id>`;
}

export function availableCommandsText() {
  return `Available commands:
  list-articles
  list-lab-evidence
  list-audit-logs [limit]
  list-refresh-suggestions [status] [limit]
  quality-summary
  set-index-status <articleId> <index|noindex|pending|refresh_needed|merge_candidate>
  set-refresh-suggestion-status <suggestionId> <open|planned|applied|dismissed>
  archive-record <entityType> <id>
  delete-record <entityType> <id>
  import-worker-outputs
  import-search-console [file]
  import-refresh-suggestions [file]`;
}
