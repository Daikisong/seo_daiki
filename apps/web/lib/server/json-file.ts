import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dataRoot = existsSync(resolve(process.cwd(), "data"))
  ? resolve(process.cwd(), "data")
  : resolve(process.cwd(), "../../data");

export function readJsonFile<T>(path: string, fallback: T): T {
  const dataPath = path.startsWith("data/") ? path.slice("data/".length) : path;
  const fullPath = resolve(dataRoot, dataPath);
  if (!existsSync(fullPath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}

export function writeJsonFile<T>(path: string, payload: T) {
  const dataPath = path.startsWith("data/") ? path.slice("data/".length) : path;
  const fullPath = resolve(dataRoot, dataPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, `${JSON.stringify(payload, null, 2)}\n`);
}
