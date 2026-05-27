import { prisma } from "./client";
import { AdminPublishGateError } from "./adminMutations";
import { parseAdminCliArgs } from "./adminCliArgs";
import { runAdminCommand } from "./adminCliCommands";

const { command, args } = parseAdminCliArgs(process.argv.slice(2));

runAdminCommand(command, args)
  .catch((error) => {
    if (error instanceof AdminPublishGateError) {
      console.error(`Publishing gate blocked index update for article ${error.articleId}.`);
      console.table(
        error.issues.map((issue) => ({
          code: issue.code,
          severity: issue.severity,
          message: issue.message
        }))
      );
      process.exit(1);
    }
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
