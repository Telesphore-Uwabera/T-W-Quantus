/**
 * Built-in admin credentials (override with ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_JWT_SECRET).
 * Set ADMIN_JWT_SECRET in production.
 */
export const BUILTIN_ADMIN_EMAIL = "twquantus2025@gmail.com";
export const BUILTIN_ADMIN_PASSWORD = "TW-Quantus";
export const BUILTIN_JWT_SECRET_FALLBACK = "tw-quantus-cms-built-in-jwt-change-in-production";

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? BUILTIN_ADMIN_EMAIL).trim().toLowerCase();
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? BUILTIN_ADMIN_PASSWORD;
}

export function getAdminJwtSecret(): string {
  return process.env.ADMIN_JWT_SECRET ?? BUILTIN_JWT_SECRET_FALLBACK;
}
