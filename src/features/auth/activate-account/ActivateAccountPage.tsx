import AuthLayout from "../components/AuthLayout";
import ActivateAccountForm from "./ActivateAccountForm";
import ActivationTokenError from "./ActivationTokenError";
import ActivationSuccess from "./ActivationSuccess";
import { useActivateAccount } from "./useActivateAccount";

export default function ActivateAccountPage() {
  const { step, details, tokenError, completeActivation } = useActivateAccount();

  return (
    <AuthLayout>
      {step === "loading" && (
        <p className="animate-pulse text-sm text-neutral-500">Activating your account…</p>
      )}

      {step === "tokenError" && tokenError && <ActivationTokenError error={tokenError} />}

      {step === "form" && details && (
        <ActivateAccountForm details={details} completeActivation={completeActivation} />
      )}

      {step === "success" && <ActivationSuccess />}
    </AuthLayout>
  );
}
