import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dataRoot = resolve(process.cwd(), "../../data");

export function readJsonFile<T>(path: string, fallback: T): T {
  const dataPath = path.startsWith("data/") ? path.slice("data/".length) : path;
  const fullPath = resolve(dataRoot, dataPath);
  if (!existsSync(fullPath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}
