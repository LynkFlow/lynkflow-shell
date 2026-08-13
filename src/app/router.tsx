/**
 * The Shell's route tree.
 *
 * This is the Shell's "MFE registry" architecture.md refers to: the mapping
 * from a URL prefix to a lazily-loaded remote's `./App`. It lives here, in
 * the Shell's own source -- not a shared package, since only the Shell ever
 * needs the full map (.claude/rules/architecture.md, .claude/rules/
 * routing-loading-errors.md).
 *
 * Auth screens (login/signup/forgot-password/reset-password/
 * activate-account) are Shell-owned pre-session screens per
 * .claude/rules/auth.md's Shell-owns-login-and-session contract --
 * GEN-US001/002/006/009 have no domain MFE mounted yet, so they render
 * here, not in a domain `*-ui`. They sit outside ShellLayout's nav-bar
 * wrapper -- see layouts/ShellLayout.tsx's header comment for why.
 */
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { RouteBoundary } from "../components/RouteBoundary/index";
import { ShellLayout } from "../layouts/ShellLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ActivateAccountPage from "../features/auth/pages/ActivateAccountPage";

// "scratch/App" resolves at runtime via Module Federation (see
// webpack.config.mjs's `remotes`); src/types/federation.d.ts gives it a type
// so this compiles. Real domains get the same treatment per remote, or a
// generated type once a real contract mechanism exists for it.
const ScratchApp = lazy(() => import("scratch/App"));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/activate-account" element={<ActivateAccountPage />} />
      <Route element={<ShellLayout />}>
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
      </Route>
    </Routes>
  );
}
