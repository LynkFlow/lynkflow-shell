import AuthLayout from "../../../layouts/AuthLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";
import ResetPasswordError from "../components/ResetPasswordError";
import ResetPasswordSuccess from "../components/ResetPasswordSuccess";
import { useResetPassword } from "../hooks/useResetPassword";

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
