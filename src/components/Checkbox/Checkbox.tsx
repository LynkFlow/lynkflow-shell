import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@lynkflow/ui-kit";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

/**
 * Not a `@lynkflow/ui-kit` component -- no Checkbox in the ui-kit yet, so
 * this stays local (moved to src/components since it's generic, not
 * auth-specific).
 *
 * Rebuilt from the original `appearance-none` + `checked:` version, which
 * didn't reliably toggle/render -- that approach styled the native
 * `<input>` directly, and a couple of things about it were fragile (a
 * background-image data URI applied unconditionally, relying on
 * `checked:bg-*` alone to make it visible). This uses the same
 * visually-hidden-input + `has-[:checked]:` pattern already proven
 * elsewhere in this repo (SignupForm's role radio buttons): a real,
 * clickable, absolutely-positioned `<input type="checkbox">` with
 * `opacity-0`, a sibling box styled via `has-[:checked]:` on its own
 * classes, and a `lucide-react` `Check` icon shown via
 * `group-has-[:checked]:opacity-100`. Native toggle behavior, so
 * react-hook-form's `{...register("field")}` spread (which needs `ref`,
 * `onChange`, `onBlur`, `name` reaching the real `<input>`) works
 * unchanged.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
      <span className="group relative flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-neutral-200 bg-white transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500 has-[:focus-visible]:ring-offset-2">
        <input
          ref={ref}
          type="checkbox"
          className={cn("absolute inset-0 z-10 cursor-pointer opacity-0", className)}
          {...rest}
        />
        <Check
          size={12}
          strokeWidth={3}
          aria-hidden="true"
          className="pointer-events-none text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100"
        />
      </span>
      {label && <span className="font-medium text-neutral-900">{label}</span>}
    </label>
  );
});

export { Checkbox };
