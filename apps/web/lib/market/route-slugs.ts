export function routeSlugMatches(storedSlug: string, routeSlug: string): boolean {
  return storedSlug === routeSlug || storedSlug === decodeRouteSlug(routeSlug);
}

export function decodeRouteSlug(routeSlug: string): string {
  try {
    return decodeURIComponent(routeSlug);
  } catch {
    return routeSlug;
  }
}
