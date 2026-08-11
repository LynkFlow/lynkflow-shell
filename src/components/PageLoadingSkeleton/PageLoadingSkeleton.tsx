/**
 * TEMPORARY LOCAL COPY -- see the note in ErrorFallback.tsx. Belongs in
 * @lynkflow/ui-kit once it ships this component.
 */
export function PageLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="p-6">
      <span className="sr-only">Loading…</span>
      <div aria-hidden="true" className="space-y-3">
        <div className="h-6 w-1/3 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-neutral-100" />
      </div>
    </div>
  );
}
