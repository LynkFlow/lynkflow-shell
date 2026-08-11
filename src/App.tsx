/**
 * The Shell's top-level layout + route tree.
 *
 * This is the Shell's "MFE registry" architecture.md refers to: the mapping
 * from a URL prefix to a lazily-loaded remote's `./App`. It lives here, in
 * the Shell's own source -- not a shared package, since only the Shell ever
 * needs the full map (.claude/rules/architecture.md, .claude/rules/
 * routing-loading-errors.md).
 *
 * Deliberately minimal, per this first pass's scope:
 *  - No auth/login. There's no `-svc` yet to authenticate against
 *    (.claude/rules/progress.md), so this renders its routes unconditionally
 *    -- no session check, no redirect-to-login. Wire up @lynkflow/auth's
 *    Shell-owns-the-session contract (.claude/rules/auth.md) when a real
 *    login flow exists to build against.
 *  - No branding. Bare layout, ui-kit tokens only, no logo/brand name beyond
 *    the plain page title.
 *  - One remote wired in, and it's a smoke-test stand-in (scratch-test-ui),
 *    not a real domain -- see webpack.config.mjs and README.md.
 */
import { lazy } from "react";
import { Link, Route, Routes as RouterRoutes } from "react-router-dom";

import { RouteBoundary } from "./components/RouteBoundary/index";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// "scratch/App" resolves at runtime via Module Federation (see
// webpack.config.mjs's `remotes`); src/types/federation.d.ts gives it a type
// so this compiles. Real domains get the same treatment per remote, or a
// generated type once a real contract mechanism exists for it.
const ScratchApp = lazy(() => import("scratch/App"));

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <nav className="flex items-center gap-6 text-sm">
          <span className="font-semibold">LynkFlow</span>
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/scratch" className="hover:underline">
            Scratch (federation smoke test)
          </Link>
        </nav>
      </header>
      <main className="p-6">
        <RouterRoutes>
          <Route index element={<HomePage />} />
          <Route
            path="/scratch/*"
            element={
              <RouteBoundary>
                <ScratchApp language="en" />
              </RouteBoundary>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </RouterRoutes>
      </main>
    </div>
  );
}
