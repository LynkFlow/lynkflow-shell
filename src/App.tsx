/**
 * The Shell's top-level layout + route tree.
 *
 * This is the Shell's "MFE registry" architecture.md refers to: the mapping
 * from a URL prefix to a lazily-loaded remote's `./App`. It lives here, in
 * the Shell's own source -- not a shared package, since only the Shell ever
 * needs the full map (.claude/rules/architecture.md, .claude/rules/
 * routing-loading-errors.md).
 *
 * Auth screens (login/signup/forgot-password/reset-password/
 * activate-account) are now real, per .claude/rules/auth.md's Shell-owns-
 * login-and-session contract -- GEN-US001/002/006/009 are pre-session
 * screens with no domain MFE mounted yet, so they render here, not in a
 * domain `*-ui`. This is scaffolding against that contract, not a finished
 * integration: there's still no real `-svc` to authenticate against
 * (.claude/rules/progress.md), no route guard/redirect-to-login for the
 * rest of the app (nothing past login exists to guard yet), and no
 * `@lynkflow/auth` session-state package (still forward guidance). See
 * README.md for the full scope note.
 *
 * Still deliberately minimal otherwise:
 *  - No branding beyond the plain page title / the auth screens' own logo.
 *  - One remote wired in, and it's a smoke-test stand-in (scratch-test-ui),
 *    not a real domain -- see webpack.config.mjs and README.md.
 */
import { lazy } from "react";
import { Link, Route, Routes as RouterRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RouteBoundary } from "./components/RouteBoundary/index";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import ActivateAccountPage from "./features/auth/pages/ActivateAccountPage";

// "scratch/App" resolves at runtime via Module Federation (see
// webpack.config.mjs's `remotes`); src/types/federation.d.ts gives it a type
// so this compiles. Real domains get the same treatment per remote, or a
// generated type once a real contract mechanism exists for it.
const ScratchApp = lazy(() => import("scratch/App"));

// One QueryClient for the whole Shell (currently only the auth screens use
// it) -- same defaults rationale as every MFE's own instance
// (.claude/rules/api-conventions.md): consistent retry/staleness behavior
// across every query/mutation in this app, set once rather than per call.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white text-neutral-900">
        <header className="border-b border-neutral-200 px-6 py-4">
          <nav className="flex items-center gap-6 text-sm">
            <span className="font-semibold">LynkFlow</span>
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/scratch" className="hover:underline">
              Scratch (federation smoke test)
            </Link>
          </nav>
        </header>
        <main>
          <RouterRoutes>
            <Route
              index
              element={
                <div className="p-6">
                  <HomePage />
                </div>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/activate-account" element={<ActivateAccountPage />} />
            <Route
              path="/scratch/*"
              element={
                <div className="p-6">
                  <RouteBoundary>
                    <ScratchApp language="en" />
                  </RouteBoundary>
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="p-6">
                  <NotFoundPage />
                </div>
              }
            />
          </RouterRoutes>
        </main>
      </div>
    </QueryClientProvider>
  );
}
