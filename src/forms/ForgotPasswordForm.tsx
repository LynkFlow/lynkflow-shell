import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@lynkflow/ui-kit";

import { FormInput } from "./FormInput";
import { Banner } from "../components/Banner";
import { authErrorPresentation } from "../features/auth/constants/errorMessages";
import { forgotPasswordFormSchema } from "../features/auth/schemas/ForgotPasswordForm.schema";
import type { ForgotPasswordFormValues } from "../features/auth/schemas/ForgotPasswordForm.schema";
import type { useForgotPassword } from "../features/auth/hooks/useForgotPassword";

interface ForgotPasswordFormProps {
  forgotPassword: ReturnType<typeof useForgotPassword>;
}

/** GEN-US003 (Forgot Password) -- react-hook-form + zod. */
export default function ForgotPasswordForm({
  forgotPassword,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Forgot your password?
      </h1>
      <p className="mb-8 text-sm text-neutral-900 sm:text-base">
        Enter your email and we'll send you a verification link to reset your password.
      </p>

      <FormProvider {...form}>
        <form
          className="space-y-8"
          onSubmit={(event) =>
            void form.handleSubmit((values) => forgotPassword.mutate(values))(event)
          }
          noValidate
        >
          <FormInput<ForgotPasswordFormValues>
            type="email"
            name="email"
            label="Email"
            autoComplete="email"
            isRequired
          />

          <Button type="submit" isLoading={forgotPassword.isPending} className="w-full">
            Send verification link
          </Button>

          {forgotPassword.error && (
            <Banner
              variant={
                authErrorPresentation[forgotPassword.error.code]?.variant ?? "error"
              }
              title={
                authErrorPresentation[forgotPassword.error.code]?.title ??
                "Something went wrong"
              }
              message={
                forgotPassword.error.message ??
                authErrorPresentation[forgotPassword.error.code]?.message ??
                "Please try again."
              }
            />
          )}
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
