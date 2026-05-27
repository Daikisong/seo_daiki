import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

export function searchConsoleRowPaths(root: string) {
  return [
    join(root, "data/snapshots/search_console_rows.json"),
    join(root, "data/snapshots/search_console_sample.json")
  ];
}

export function searchConsoleSuggestionPaths(root: string) {
  return [join(root, "data/exports/search_console_suggestions.json")];
}

export async function readFirstJson<T>(paths: string[]): Promise<T> {
  for (const path of paths) {
    if (existsSync(path)) {
      return JSON.parse(await readFile(path, "utf-8")) as T;
    }
  }
  return [] as T;
}

export function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}
