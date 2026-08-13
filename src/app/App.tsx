/**
 * The Shell's root component: every app-wide provider, wrapping the route
 * tree. Kept deliberately thin -- provider composition lives in
 * providers.tsx, the route tree lives in router.tsx, app-wide config lives
 * in config.ts. This file's only job is wiring those three together.
 */
import { Providers } from "./providers";
import { AppRouter } from "./router";

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
