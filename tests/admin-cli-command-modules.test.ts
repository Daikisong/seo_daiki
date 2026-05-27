import assert from "node:assert/strict";
import {
  adminCommandHandlers,
  runAdminCommand
} from "../packages/db/src/adminCliCommands";
import { runArticleAdminCommand } from "../packages/db/src/adminCliArticleCommands";
import { runEvidenceAdminCommand } from "../packages/db/src/adminCliEvidenceCommands";
import { runImportAdminCommand } from "../packages/db/src/adminCliImportCommands";
import { runRecordAdminCommand } from "../packages/db/src/adminCliRecordCommands";
import { runRefreshAdminCommand } from "../packages/db/src/adminCliRefreshCommands";
import {
  adminCommandHandled,
  adminCommandNotHandled
} from "../packages/db/src/adminCliCommandResult";

async function captureConsoleLog(callback: () => Promise<void>) {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    await callback();
  } finally {
    console.log = originalLog;
  }
  return logs;
}

async function main() {
  assert.equal(adminCommandHandlers.includes(runArticleAdminCommand), true);
  assert.equal(adminCommandHandlers.includes(runEvidenceAdminCommand), true);
  assert.equal(adminCommandHandlers.includes(runRefreshAdminCommand), true);
  assert.equal(adminCommandHandlers.includes(runRecordAdminCommand), true);
  assert.equal(adminCommandHandlers.includes(runImportAdminCommand), true);

  assert.deepEqual(adminCommandHandled(), { handled: true });
  assert.equal(adminCommandNotHandled.handled, false);

  assert.equal(await runArticleAdminCommand("unknown-command", []), adminCommandNotHandled);
  assert.equal(await runEvidenceAdminCommand("unknown-command", []), adminCommandNotHandled);
  assert.equal(await runRefreshAdminCommand("unknown-command", []), adminCommandNotHandled);
  assert.equal(await runRecordAdminCommand("unknown-command", []), adminCommandNotHandled);
  assert.equal(await runImportAdminCommand("unknown-command", []), adminCommandNotHandled);

  const logs = await captureConsoleLog(async () => {
    await runAdminCommand(undefined, []);
  });
  assert.match(logs.join("\n"), /list-articles/);
  assert.match(logs.join("\n"), /import-search-console/);
}

main()
  .then(() => {
    console.log("Admin CLI command module tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
