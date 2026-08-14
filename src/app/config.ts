/** App-wide, non-secret config. `__AUTH_API_BASE_URL__` is swapped in at build time via webpack's DefinePlugin (see .env.example). */
declare const __AUTH_API_BASE_URL__: string;

export const env = {
  authApiBaseUrl: __AUTH_API_BASE_URL__,
} as const;

export type Env = typeof env;

/** The DOM node id app/bootstrap.tsx mounts React into. */
export const ROOT_ELEMENT_ID = "root";

/** Shared defaults for the Shell's one QueryClient. */
export const QUERY_CLIENT_DEFAULT_OPTIONS = {
  queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
} as const;
