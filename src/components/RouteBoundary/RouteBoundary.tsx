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

/** ErrorBoundary + Suspense with configurable fallbacks, for wrapping a federated remote (routing-loading-errors.md). */
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
