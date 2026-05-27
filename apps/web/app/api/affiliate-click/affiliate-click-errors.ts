export function isAffiliateRedirectError(error: unknown): error is { name: string; message: string; status: number } {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "name" in error &&
    error.name === "AffiliateRedirectError" &&
    "message" in error &&
    typeof error.message === "string" &&
    "status" in error &&
    typeof error.status === "number"
  );
}
