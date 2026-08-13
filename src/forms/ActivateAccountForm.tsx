import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@lynkflow/ui-kit";

import { PasswordFormInput } from "./FormInput";
import { Checkbox } from "../components/Checkbox";
import { Banner } from "../components/Banner";
import PasswordChecklist from "../features/auth/components/PasswordChecklist";
import { authErrorPresentation } from "../features/auth/constants/errorMessages";
import { activateAccountFormSchema } from "../features/auth/schemas/ActivateAccountForm.schema";
import type { ActivateAccountFormValues } from "../features/auth/schemas/ActivateAccountForm.schema";
import type { ActivationDetails } from "../features/auth/types/auth.types";
import type { useActivateAccount } from "../features/auth/hooks/useActivateAccount";

interface ActivateAccountFormProps {
  details: ActivationDetails;
  completeActivation: ReturnType<typeof useActivateAccount>["completeActivation"];
}

/** GEN-US006 (Account Activation) -- react-hook-form + zod. */
export default function ActivateAccountForm({
  details,
  completeActivation,
}: ActivateAccountFormProps) {
  const form = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
  });
  const { register, control } = form;
  // useWatch, not form.watch() -- see SignupForm.tsx's comment on the same
  // pattern (react-hooks/incompatible-library).
  const password = useWatch({ control, name: "password" });

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Activate your account
      </h1>
      <p className="mb-8 text-sm text-neutral-500 sm:text-base">
        Set a password for{" "}
        <span className="font-medium text-neutral-900">{details.account.email}</span> to
        finish setting up your account.
      </p>

      <FormProvider {...form}>
        <form
          className="space-y-4"
          onSubmit={(event) =>
            void form.handleSubmit((values) =>
              completeActivation.mutate({
                password: values.password,
                confirmPassword: values.confirmPassword,
                termsAccepted: values.termsAccepted,
                privacyPolicyAccepted: values.privacyPolicyAccepted,
              }),
            )(event)
          }
          noValidate
        >
          {completeActivation.error && (
            <Banner
              variant={
                authErrorPresentation[completeActivation.error.code]?.variant ?? "error"
              }
              title={
                authErrorPresentation[completeActivation.error.code]?.title ??
                "Something went wrong"
              }
              message={
                completeActivation.error.message ??
                authErrorPresentation[completeActivation.error.code]?.message ??
                "Please try again."
              }
            />
          )}

          <PasswordFormInput<ActivateAccountFormValues>
            name="password"
            label="Password"
            autoComplete="new-password"
            isRequired
          />
          <PasswordFormInput<ActivateAccountFormValues>
            name="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
            isRequired
          />

          <div>
            <p className="mb-2 text-sm text-neutral-500">Your password must include:</p>
            <PasswordChecklist password={password} />
          </div>

          <div className="space-y-2">
            <Checkbox
              label={`I agree to the Terms & Conditions (v${details.agreements.termsVersion})`}
              {...register("termsAccepted")}
            />
            <Checkbox
              label={`I agree to the Privacy Policy (v${details.agreements.privacyPolicyVersion})`}
              {...register("privacyPolicyAccepted")}
            />
          </div>

          <Button
            type="submit"
            isLoading={completeActivation.isPending}
            className="w-full"
          >
            Activate Account
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
