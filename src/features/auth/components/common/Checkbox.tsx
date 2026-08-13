import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

/**
 * Not a `@lynkflow/ui-kit` component -- no Checkbox in the ui-kit yet, so
 * this stays local (leave-as-is per the migration instruction). Colors
 * retargeted from the reference's ad hoc `input-border`/`brand` classes to
 * real ui-kit tokens (`neutral-200`, `primary-500`).
 *
 * `forwardRef` + the full native input prop set (not the original's narrow
 * `Pick`) so `{...register("fieldName")}` -- react-hook-form's checkbox
 * registration, which needs `ref`/`onBlur` as well as `onChange`/`name` --
 * can spread directly onto this component (used by LoginForm's "Remember
 * Me" and ActivateAccountForm's terms/privacy checkboxes).
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, ...rest },
  ref,
) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        className="h-5 w-5 appearance-none rounded border-2 border-neutral-200 bg-white bg-center bg-no-repeat checked:border-primary-500 checked:bg-primary-500"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6L5 9L10 3' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundSize: "15px 15px",
        }}
        {...rest}
      />
      {label && <span className="font-medium text-neutral-900">{label}</span>}
    </label>
  );
});

export default Checkbox;
