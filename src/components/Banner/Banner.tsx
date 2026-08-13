import {
  AlertCircle,
  AlertTriangle,
  CheckCircleIcon,
  LockKeyhole,
  PauseCircleIcon,
} from "lucide-react";

/**
 * Owned here, not by the auth feature -- Banner moved to src/components
 * (generic/reusable, not auth-specific) so its own variant type shouldn't
 * depend on anything under features/auth. `errorMessages.ts` imports this
 * type FROM here, not the other way around.
 */
export type BannerVariant = "error" | "warning" | "success";

interface BannerProps {
  variant: BannerVariant;
  title: string;
  message?: string;
  details?: string[];
}

/**
 * Not a `@lynkflow/ui-kit` component -- there's no Banner/Alert in the
 * ui-kit yet, so this stays local per the instruction to leave anything not
 * already in the toolkit as-is. Genuinely reusable outside the auth feature
 * (any domain can show a success/warning/error banner), which is why it
 * lives in src/components rather than features/auth/components. The one
 * adaptation made from the reference implementation: the error variant's
 * colors now come from real ui-kit tokens (`color.danger` /
 * `color.dangerSubtle`) instead of hardcoded hex -- those two ARE already in
 * the ui-kit, and it turns out they were sourced from the exact same Figma
 * frame ("Login/ locked account") this banner is for
 * (lynkflow-ui-kit/src/tokens/index.ts), so the hardcoded `#FEE4E2`/`#B42318`
 * this had were literally duplicating `dangerSubtle`/`danger` by coincidence.
 * `warning`/`success` have no light "subtle" background tint tokenized yet
 * (`color.warning`/`color.success` are single flat values, not a ramp) --
 * left on Tailwind's own amber/green scale, same as the reference
 * implementation, until the ui-kit adds one.
 */
const variantStyles: Record<
  BannerVariant,
  { container: string; icon: string; Icon: typeof AlertCircle; sidebar: string }
> = {
  error: {
    container: "border-0 bg-danger-subtle text-danger",
    icon: "text-danger",
    Icon: AlertCircle,
    sidebar: "bg-danger",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "text-amber-500",
    Icon: AlertTriangle,
    sidebar: "bg-warning",
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-700",
    icon: "text-green-600",
    Icon: CheckCircleIcon,
    sidebar: "bg-success",
  },
};

export function Banner({ variant, title, message, details }: BannerProps) {
  const { container, icon, sidebar } = variantStyles[variant];

  const Icon: typeof AlertCircle =
    title === "Account Locked"
      ? LockKeyhole
      : title === "Invalid email address or password."
        ? variantStyles[variant].Icon
        : PauseCircleIcon;

  return (
    <div className={`mt-8 flex flex-row overflow-hidden rounded-lg border ${container}`}>
      <div className={`min-w-1 max-w-1.5 ${sidebar}`} />
      <div className="my-4 ms-3 me-8 flex flex-row">
        <Icon size={24} className={`me-2 shrink-0 ${icon}`} />
        <div className="flex flex-col justify-center gap-0.5">
          <p className="font-sans font-semibold">{title}</p>
          {message && <p className="mt-0.5 text-[13px] text-neutral-500 opacity-90">{message}</p>}
          {details && details.length > 0 && (
            <ul className="mt-1.5 list-disc space-y-0.5 ps-4 text-[13px] opacity-90">
              {details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
