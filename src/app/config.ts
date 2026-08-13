/**
 * App-wide, non-secret configuration -- the one place build-time config and
 * small app-level constants are read/defined, so nothing else reaches for a
 * magic global or hardcodes a value that's really configuration.
 *
 * Build-time values (the `env` export) use the same mechanism as every
 * other LynkFlow app repo (see lynkflow-mfe-template/src/env.ts): webpack's
 * DefinePlugin swaps the `__NAME__` tokens below for string literals at
 * build time, sourced from `.env` (see `.env.example`) via dotenv in
 * webpack.config.mjs.
 */
declare const __AUTH_API_BASE_URL__: string;

export const env = {
  /**
   * Base URL of the auth backend the Shell's own login/signup/
   * forgot-password/reset-password/activate-account screens call
   * (.claude/rules/auth.md -- these are Shell-owned, pre-session screens,
   * not a domain MFE's concern). No real service exists yet
   * (.claude/rules/progress.md); this is scaffolding against the contract
   * assumed by the reference implementation this was migrated from.
   */
  authApiBaseUrl: __AUTH_API_BASE_URL__,
} as const;

export type Env = typeof env;

/** The DOM node id app/bootstrap.tsx mounts React into. */
export const ROOT_ELEMENT_ID = "root";

/**
 * Defaults for the one QueryClient shared across the whole Shell
 * (.claude/rules/api-conventions.md: consistent retry/staleness behavior
 * across every query/mutation, set once rather than per call site).
 */
export const QUERY_CLIENT_DEFAULT_OPTIONS = {
  queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
} as const;
