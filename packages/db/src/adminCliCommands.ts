import { availableCommandsText } from "./adminCliArgs";
import type { AdminCommandHandler } from "./adminCliCommandResult";
import { runArticleAdminCommand } from "./adminCliArticleCommands";
import { runEvidenceAdminCommand } from "./adminCliEvidenceCommands";
import { runImportAdminCommand } from "./adminCliImportCommands";
import { runRecordAdminCommand } from "./adminCliRecordCommands";
import { runRefreshAdminCommand } from "./adminCliRefreshCommands";

export const adminCommandHandlers: AdminCommandHandler[] = [
  runArticleAdminCommand,
  runEvidenceAdminCommand,
  runRefreshAdminCommand,
  runRecordAdminCommand,
  runImportAdminCommand
];

export async function runAdminCommand(command: string | undefined, args: string[]) {
  for (const handler of adminCommandHandlers) {
    const result = await handler(command, args);
    if (result.handled) {
      return;
    }
  }

  console.log(availableCommandsText());
}
