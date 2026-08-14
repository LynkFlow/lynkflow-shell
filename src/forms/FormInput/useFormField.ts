import { useController, useFormContext } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";

/** Thin adapter over react-hook-form's `useController`, scoped to the enclosing `<FormProvider>` (forms.md). Private to `FormInput`. */
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
