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
 *  - No session state yet. There's no `-svc` for auth-ui's screens to call
 *    (.claude/rules/progress.md), and @lynkflow/auth (the Shell-owns-the-
 *    session contract, .claude/rules/auth.md) doesn't exist yet either --
 *    /auth/* is federated in, but nothing here reacts to a successful login.
 *  - No branding. Bare layout, ui-kit tokens only, no logo/brand name beyond
 *    the plain page title.
 *  - Two remotes wired in: `scratch` is a smoke-test stand-in
 *    (scratch-test-ui, not a real domain), `auth` is the first real one --
 *    see webpack.config.mjs and README.md.
 */
import { lazy } from "react";
import { Link, Route, Routes as RouterRoutes } from "react-router-dom";

import { RouteBoundary } from "./components/RouteBoundary/index";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// "scratch/App" and "auth/App" resolve at runtime via Module Federation (see
// webpack.config.mjs's `remotes`); src/types/federation.d.ts gives each a
// type so this compiles. Real domains get the same treatment per remote, or
// a generated type once a real contract mechanism exists for it.
//
// Mounts auth-ui's `./App`, not its `./Routes` -- `./Routes` is the bare
// <Route> tree with no providers, and auth-ui's screens need the
// QueryClientProvider/I18nextProvider that only `./App` sets up (see that
// file's own docblock in the auth-ui repo). `./Routes` is exposed for a
// future host that already provides that context itself; the Shell doesn't
// yet.
const ScratchApp = lazy(() => import("scratch/App"));
const AuthApp = lazy(() => import("auth/App"));

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <nav className="flex items-center gap-6 text-sm">
          <span className="font-semibold">LynkFlow</span>
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/auth/login" className="hover:underline">
            Login
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
            path="/auth/*"
            element={
              <RouteBoundary>
                <AuthApp language="en" />
              </RouteBoundary>
            }
          />
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
