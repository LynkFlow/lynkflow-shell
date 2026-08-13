import type { FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@lynkflow/ui-kit";
import type { InputProps } from "@lynkflow/ui-kit";

import { useFormField } from "./useFormField";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<InputProps, "id" | "name" | "value" | "onChange" | "onBlur" | "error"> {
  /** The field's name in the enclosing form -- same string `register()` would take. */
  name: FieldPath<TFieldValues>;
}

/**
 * A form field with zero manual wiring at the call site. Same pattern as
 * lynkflow-mfe-template/src/forms/FormInput/FormInput.tsx -- ported here
 * because the Shell's own auth screens (login/signup/forgot-password/
 * reset-password/activate-account, .claude/rules/auth.md) are forms too, and
 * forms.md's react-hook-form + zod + FormInput pattern is a platform
 * convention, not something specific to a domain MFE.
 *
 * ```tsx
 * <FormProvider {...form}>
 *   <FormInput<LoginFormValues> name="email" label="Email" isRequired />
 * </FormProvider>
 * ```
 */
export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  ...rest
}: FormInputProps<TFieldValues>) {
  const { field, error, id } = useFormField<TFieldValues>(name);

  return (
    <Input {...field} id={id} {...(error !== undefined ? { error } : {})} {...rest} />
  );
}
