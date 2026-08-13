import { useController, useFormContext } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";

/**
 * Thin adapter over react-hook-form's `useController`, scoped to whichever
 * form is currently provided via `<FormProvider>` (see
 * `.claude/rules/forms.md` at the workspace root for the full pattern).
 * Same copy as lynkflow-mfe-template/src/forms/FormInput/useFormField.ts --
 * deliberately duplicated per-repo (no shared forms package, see forms.md),
 * ported here because the Shell now owns forms too (its own login/signup/
 * forgot-password/reset-password/activate-account screens -- see
 * .claude/rules/auth.md).
 *
 * Private to `FormInput` -- not re-exported from `index.ts`.
 */
export function useFormField<TFieldValues extends FieldValues = FieldValues>(
  name: FieldPath<TFieldValues>,
) {
  const { control } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController<TFieldValues>({ name, control });

  const id = name.replace(/\./g, "-");

  return {
    field,
    error: fieldState.error?.message,
    id,
    messageId: `${id}-message`,
  };
}
