import { Suspense } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";

import { ErrorFallback } from "../ErrorFallback/index";
import { PageLoadingSkeleton } from "../PageLoadingSkeleton/index";

export interface RouteBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<FallbackProps>;
  loadingFallback?: ReactNode;
  onError?: (error: unknown, info: ErrorInfo) => void;
}

/**
 * Same component/contract as lynkflow-mfe-template's RouteBoundary
 * (.claude/rules/routing-loading-errors.md) -- ErrorBoundary + Suspense with
 * configurable fallbacks. The Shell needs its own copy for the same reason
 * every MFE does: this wraps how the SHELL handles a remote failing to load
 * or crashing on mount (layer 1 of that rule file's "three layers"), which
 * is a distinct concern from an MFE wrapping its own internal subtree
 * (layer 2) -- both repos need the primitive, neither imports it from the
 * other (.claude/rules/architecture.md's no-cross-repo-source-import rule).
 */
export function RouteBoundary({
  children,
  fallback = ErrorFallback,
  loadingFallback = <PageLoadingSkeleton />,
  onError,
}: RouteBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={fallback} {...(onError ? { onError } : {})}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
