export interface UnsafeTargetRedirectEnv {
  NODE_ENV?: string;
  ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT?: string;
}

export function isUnsafeTargetRedirectAllowed(env: UnsafeTargetRedirectEnv = process.env) {
  return env.NODE_ENV !== "production" && env.ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT === "true";
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
