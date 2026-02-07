// src/common/jwt.ts
export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || !String(s).trim()) {
    // development fallback; in production prefer to throw
    return "changeme";
  }
  return String(s).trim();
}
