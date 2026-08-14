/**
 * The Shell's route tree -- its MFE registry (URL prefix -> remote `./App`).
 * Auth screens are Shell-owned pre-session screens (auth.md) and sit outside
 * ShellLayout's nav-bar wrapper.
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

// Resolves at runtime via Module Federation; typed by src/types/federation.d.ts.
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
