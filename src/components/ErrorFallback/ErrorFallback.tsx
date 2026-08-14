import type { FallbackProps } from "react-error-boundary";
import { Button } from "@lynkflow/ui-kit";

// Temporary local copy -- belongs in @lynkflow/ui-kit once it ships one.
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/5 p-6 text-start"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-900">
        Something went wrong
      </h2>
      <p className="mb-4 text-sm text-neutral-700">{message}</p>
      <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}
