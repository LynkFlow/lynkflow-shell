import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@lynkflow/ui-kit";

import { FormInput, PasswordFormInput } from "./FormInput";
import { Banner } from "../components/Banner";
import PasswordChecklist from "../features/auth/components/PasswordChecklist";
import { useSignup } from "../features/auth/hooks/useSignup";
import { authErrorPresentation } from "../features/auth/constants/errorMessages";
import { signupFormSchema } from "../features/auth/schemas/SignupForm.schema";
import type { SignupFormValues } from "../features/auth/schemas/SignupForm.schema";
import type { SignupAccountType } from "@lynkflow/types";

const roleOptions: { value: SignupAccountType; label: string }[] = [
  { value: "real_estate_developer", label: "Real estate Developer" },
  { value: "brokerage_company", label: "Brokerage Company" },
  { value: "sales_agent", label: "Sales Agent" },
];

/** GEN-US003-ish (Signup) -- react-hook-form + zod, per .claude/rules/forms.md. */
export default function SignupForm() {
  const signup = useSignup();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      accountType: "real_estate_developer",
      fullName: "",
      email: "",
      company: "",
      password: "",
    },
  });
  const { handleSubmit, register, control } = form;
  // useWatch, not form.watch() -- watch() isn't safely memoizable by React's compiler.
  const accountType = useWatch({ control, name: "accountType" });
  const password = useWatch({ control, name: "password" });

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5"
        onSubmit={(event) =>
          void handleSubmit((values) => signup.mutate(values))(event)
        }
        noValidate
      >
        <div className="flex flex-col space-y-3">
          <p className="font-sans font-normal text-neutral-400">I am</p>
          {roleOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <span
                className={`relative me-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-200 ${
                  accountType === option.value ? "bg-primary-500" : "bg-white"
                }`}
              >
                <input
                  className="absolute inset-0 cursor-pointer opacity-0"
                  type="radio"
                  value={option.value}
                  {...register("accountType")}
                />
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    accountType === option.value ? "bg-white" : "bg-transparent"
                  }`}
                />
              </span>
              <p className="font-sans">{option.label}</p>
            </label>
          ))}
        </div>

        <FormInput<SignupFormValues> name="fullName" label="Full Name" isRequired />
        <FormInput<SignupFormValues>
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          isRequired
        />
        <FormInput<SignupFormValues> name="company" label="Company" isRequired />
        <PasswordFormInput<SignupFormValues>
          name="password"
          label="Password"
          autoComplete="new-password"
          isRequired
        />

        {signup.error && (
          <Banner
            variant={authErrorPresentation[signup.error.code]?.variant ?? "error"}
            title={
              authErrorPresentation[signup.error.code]?.title ?? "Something went wrong"
            }
            message={
              signup.error.message ??
              authErrorPresentation[signup.error.code]?.message ??
              "Please try again."
            }
          />
        )}

        <div>
          <p className="mb-2 text-sm text-neutral-500">
            Your new password must include:
          </p>
          <PasswordChecklist password={password} />
        </div>

        <Button type="submit" isLoading={signup.isPending} className="mt-3 w-full">
          Create Account
        </Button>
      </form>
    </FormProvider>
  );
}
