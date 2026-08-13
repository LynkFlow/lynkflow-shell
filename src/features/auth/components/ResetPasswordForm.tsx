import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@lynkflow/ui-kit";

import { PasswordFormInput } from "../../../forms/FormInput";
import Banner from "./common/Banner";
import PasswordChecklist from "./common/PasswordChecklist";
import { authErrorPresentation } from "../constants/errorMessages";
import { resetPasswordFormSchema } from "./ResetPasswordForm.schema";
import type { ResetPasswordFormValues } from "./ResetPasswordForm.schema";
import type { useResetPassword } from "../hooks/useResetPassword";

interface ResetPasswordFormProps {
  resetPassword: ReturnType<typeof useResetPassword>["resetPassword"];
}

/** GEN-US004 (Reset Password) -- react-hook-form + zod. */
export default function ResetPasswordForm({ resetPassword }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  // useWatch, not form.watch() -- see SignupForm.tsx's comment on the same
  // pattern (react-hooks/incompatible-library).
  const password = useWatch({ control: form.control, name: "newPassword" });

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Set a new password
      </h1>
      <p className="mb-8 text-sm text-neutral-500 sm:text-base">
        Choose a strong password for best security.
      </p>

      <FormProvider {...form}>
        <form
          className="space-y-4"
          onSubmit={(event) =>
            void form.handleSubmit((values) =>
              resetPassword.mutate({
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
              }),
            )(event)
          }
          noValidate
        >
          <PasswordFormInput<ResetPasswordFormValues>
            name="newPassword"
            label="New Password"
            autoComplete="new-password"
            isRequired
          />
          <PasswordFormInput<ResetPasswordFormValues>
            name="confirmPassword"
            label="Confirm New Password"
            autoComplete="new-password"
            isRequired
          />

          {resetPassword.error && (
            <Banner
              variant={authErrorPresentation[resetPassword.error.code]?.variant ?? "error"}
              title={
                authErrorPresentation[resetPassword.error.code]?.title ??
                "Something went wrong"
              }
              message={
                resetPassword.error.message ??
                authErrorPresentation[resetPassword.error.code]?.message ??
                "Please try again."
              }
            />
          )}

          <div>
            <p className="mb-2 text-sm text-neutral-500">Your new password must include:</p>
            <PasswordChecklist password={password} />
          </div>

          <Button type="submit" isLoading={resetPassword.isPending} className="w-full">
            Reset Password
          </Button>
        </form>
      </FormProvider>

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:underline"
      >
        <ArrowLeft size={14} /> Back to Login
      </Link>
    </>
  );
}
