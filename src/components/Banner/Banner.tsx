import {
  AlertCircle,
  AlertTriangle,
  CheckCircleIcon,
  LockKeyhole,
  PauseCircleIcon,
} from "lucide-react";

/** Not `@lynkflow/ui-kit`-owned yet (no Banner/Alert there); genuinely reusable outside auth, so it lives in src/components. */
export type BannerVariant = "error" | "warning" | "success";

interface BannerProps {
  variant: BannerVariant;
  title: string;
  message?: string;
  details?: string[];
}

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
