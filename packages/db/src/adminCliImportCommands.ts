import {
  importRefreshSuggestions,
  importSearchConsoleSnapshot,
  importWorkerEvidence
} from "./importWorkerOutputs";
import { adminCommandHandled, adminCommandNotHandled } from "./adminCliCommandResult";

export async function runImportAdminCommand(command: string | undefined, args: string[]) {
  if (command === "import-worker-outputs") {
    const summary = await importWorkerEvidence();
    console.table([summary]);
    return adminCommandHandled();
  }

  if (command === "import-search-console") {
    const [file] = args;
    const summary = await importSearchConsoleSnapshot(file);
    console.table([summary]);
    return adminCommandHandled();
  }

  if (command === "import-refresh-suggestions") {
    const [file] = args;
    const summary = await importRefreshSuggestions(file);
    console.table([summary]);
    return adminCommandHandled();
  }

  return adminCommandNotHandled;
}
