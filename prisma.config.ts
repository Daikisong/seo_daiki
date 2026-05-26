import "dotenv/config";
import { defineConfig } from "prisma/config";

const defaultDatabaseUrl =
  "postgresql://global_import_lab:global_import_lab@localhost:5432/global_import_lab?schema=public";

export default defineConfig({
  schema: "packages/db/prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl
  },
  migrations: {
    path: "packages/db/prisma/migrations",
    seed: "pnpm --filter @global-import-lab/db seed"
  }
});
