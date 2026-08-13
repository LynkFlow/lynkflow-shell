/**
 * The one place build-time configuration is read.
 *
 * Same mechanism as every LynkFlow app repo (see
 * lynkflow-mfe-template/src/env.ts): webpack's DefinePlugin swaps the
 * `__NAME__` tokens below for string literals at build time, sourced from
 * `.env` (see `.env.example`) via dotenv in webpack.config.mjs. Every other
 * file imports `env` from here rather than reaching for a magic global.
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
