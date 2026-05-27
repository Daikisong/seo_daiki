type DbContentRepository = typeof import("@global-import-lab/db/content");

export async function withDbContent<T>(
  loadFromDb: (db: DbContentRepository) => Promise<T>,
  loadFromSamples: () => T
): Promise<T> {
  if (process.env.CONTENT_SOURCE !== "database") {
    return loadFromSamples();
  }

  try {
    const db = await import("@global-import-lab/db/content");
    return await loadFromDb(db);
  } catch (error) {
    console.warn("Falling back to sample content because database content could not be loaded.", error);
    return loadFromSamples();
  }
}
