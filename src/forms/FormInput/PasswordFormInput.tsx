import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { FormInput } from "./FormInput";
import type { FormInputProps } from "./FormInput";

/** Password field with a show/hide toggle. Not a `@lynkflow/ui-kit` component yet -- swap for the real one once it ships. */
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
