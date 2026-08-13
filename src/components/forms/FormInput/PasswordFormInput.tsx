import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { FormInput } from "./FormInput";
import type { FormInputProps } from "./FormInput";

/**
 * A password field with a show/hide toggle -- NOT a `@lynkflow/ui-kit`
 * component, because `Input`'s own docblock explicitly defers this to a
 * future `PasswordInput` rather than folding it into `Input`'s props
 * (lynkflow-ui-kit/src/components/Input/Input.tsx). Per the instruction to
 * leave anything not yet in the ui-kit as-is for now, this stays local --
 * same bucket as `Checkbox`/`Banner`/`Logo` in
 * `../../features/auth/components/common/`. Swap this for the real ui-kit
 * component the day it ships.
 *
 * Composes `FormInput` (not `Input` directly) so it still gets `Input`'s
 * label/error/aria wiring for free -- it only adds the toggle button
 * positioned over the field.
 */
export function PasswordFormInput<TFieldValues extends FieldValues = FieldValues>(
  props: Omit<FormInputProps<TFieldValues>, "type">,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <FormInput<TFieldValues> {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute end-3 top-6.5 -translate-y-1/2 text-neutral-400 hover:text-neutral-500"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
