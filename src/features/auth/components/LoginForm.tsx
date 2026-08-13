import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@lynkflow/ui-kit";

import { FormInput, PasswordFormInput } from "../../../components/forms/FormInput";
import { Checkbox } from "../../../components/Checkbox";
import { Banner } from "../../../components/Banner";
import { useLogin } from "../hooks/useLogin";
import { authErrorPresentation } from "../constants/errorMessages";
import { loginFormSchema } from "../schemas/LoginForm.schema";
import type { LoginFormValues } from "../schemas/LoginForm.schema";

/**
 * GEN-US002 (Login). react-hook-form + zod, per .claude/rules/forms.md --
 * the reference implementation used raw useState per field; this replaces
 * that with the platform's standard FormInput/schema pattern (same as
 * lynkflow-mfe-template's ExampleForm).
 */
export default function LoginForm() {
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const { handleSubmit, register } = form;

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5"
        onSubmit={(event) =>
          void handleSubmit((values) => login.mutate(values))(event)
        }
        noValidate
      >
        <FormInput<LoginFormValues>
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          isRequired
        />
        <PasswordFormInput<LoginFormValues>
          name="password"
          label="Password"
          autoComplete="current-password"
          isRequired
        />

        <div className="flex flex-row items-center justify-between">
          <Checkbox label="Remember Me" {...register("rememberMe")} />
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {login.error && (
          <Banner
            variant={authErrorPresentation[login.error.code]?.variant ?? "error"}
            title={authErrorPresentation[login.error.code]?.title ?? "Something went wrong"}
            message={
              login.error.message ??
              authErrorPresentation[login.error.code]?.message ??
              "Please try again."
            }
          />
        )}

        <Button type="submit" isLoading={login.isPending} className="w-full">
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
