import AuthLayout from "../components/AuthLayout";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordError from "./ResetPasswordError";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import { useResetPassword } from "./useResetPassword";

export default function ResetPasswordPage() {
  const { tokenState, tokenError, resetPassword } = useResetPassword();

  return (
    <AuthLayout>
      {tokenState === "checking" && (
        <p className="animate-pulse text-sm text-neutral-500">Checking your reset link…</p>
      )}

      {tokenState === "invalid" && tokenError && <ResetPasswordError error={tokenError} />}

      {tokenState === "valid" && !resetPassword.isSuccess && (
        <ResetPasswordForm resetPassword={resetPassword} />
      )}

      {resetPassword.isSuccess && <ResetPasswordSuccess />}
    </AuthLayout>
  );
}
