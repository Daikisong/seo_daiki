export function boundedTrendSignalLimit(limit = 100) {
  return Math.min(Math.max(limit, 1), 500);
}
