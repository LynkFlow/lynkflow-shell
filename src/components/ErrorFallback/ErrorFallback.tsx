import type { FallbackProps } from "react-error-boundary";
import { Button } from "@lynkflow/ui-kit";

/**
 * TEMPORARY LOCAL COPY -- same situation as lynkflow-mfe-template's
 * ErrorFallback (see that file's own docblock). Belongs in @lynkflow/ui-kit
 * per .claude/rules/routing-loading-errors.md; lives here only because
 * ui-kit@0.1.0 doesn't ship it yet. Delete this folder and import from the
 * package once it does -- don't let two hand-maintained copies drift.
 */
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
