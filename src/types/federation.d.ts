/**
 * Manual type stubs for Module Federation remotes -- webpack resolves
 * "scratch/App" at RUNTIME (see webpack.config.mjs's `remotes`), so
 * TypeScript has no way to see it without a declaration like this one.
 *
 * This is a per-remote, hand-written stub, not a generated contract --
 * standard practice for MF + TypeScript, and separate from
 * @lynkflow/types's job (that package is for API request/response DTOs
 * crossing a UI<->service boundary, .claude/rules/architecture.md -- a
 * federated component's prop shape isn't that). Add one block per remote
 * as real domains come online; delete this one when the smoke-test
 * "scratch" remote is retired (see README.md).
 */
declare module "scratch/App" {
  import type { ComponentType } from "react";

  export interface RemoteAppProps {
    language?: string;
  }

  const App: ComponentType<RemoteAppProps>;
  export default App;
}
