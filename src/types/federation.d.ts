// Manual type stub for a Module Federation remote resolved at runtime.
// Add one block per remote; delete when the "scratch" smoke test is retired.
declare module "scratch/App" {
  import type { ComponentType } from "react";

  export interface RemoteAppProps {
    language?: string;
  }

  const App: ComponentType<RemoteAppProps>;
  export default App;
}
