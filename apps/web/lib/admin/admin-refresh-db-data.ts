import { normalizePersistedRefreshSuggestion } from "./admin-section-normalizers";

export async function readPersistedRefreshSuggestions() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listRefreshSuggestions } = await import("@global-import-lab/db/search-console");
    const rows = await listRefreshSuggestions({ limit: 100 });
    return rows.map((row) => ({
      ...normalizePersistedRefreshSuggestion(row)
    }));
  } catch (error) {
    console.warn("Persisted refresh suggestions unavailable.", error);
    return [];
  }
}
