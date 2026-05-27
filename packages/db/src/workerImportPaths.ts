import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { WorkerPack } from "./workerImportRecords";

export function loadWorkerEvidencePacks(root: string) {
  const evidenceDir = join(root, "data/evidence_packs");
  if (!existsSync(evidenceDir)) {
    return [];
  }
  return readdirSync(evidenceDir)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => readJsonFile<WorkerPack[]>(join(evidenceDir, file)));
}

export function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export function defaultExistingPath(root: string, paths: string[]) {
  const found = paths.map((path) => join(root, path)).find((path) => existsSync(path));
  if (!found) {
    throw new Error(`None of these files exist: ${paths.join(", ")}`);
  }
  return found;
}

export function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "data")) && existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}
