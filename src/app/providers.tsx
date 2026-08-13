import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT_DEFAULT_OPTIONS } from "./config";

// One QueryClient for the whole Shell (currently only the auth screens use
// it) -- see config.ts's QUERY_CLIENT_DEFAULT_OPTIONS for the reasoning.
const queryClient = new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULT_OPTIONS });

/**
 * Every app-wide provider the Shell needs, composed in one place. Currently
 * just TanStack Query; a future provider (e.g. an `@lynkflow/auth` session
 * context once that package exists, .claude/rules/auth.md) wraps here too,
 * rather than being added ad hoc in app/App.tsx.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
