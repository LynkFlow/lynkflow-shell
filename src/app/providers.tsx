import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT_DEFAULT_OPTIONS } from "./config";

const queryClient = new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULT_OPTIONS });

/** Every app-wide provider the Shell needs, composed in one place. */
export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
