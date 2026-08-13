import AuthLayout from "../../../layouts/AuthLayout";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import CheckEmailNotice from "../components/CheckEmailNotice";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  return (
    <AuthLayout>
      {forgotPassword.isSuccess ? (
        <CheckEmailNotice
          // .variables is the payload from the last mutate() call --
          // TanStack Query keeps it around after success, so "resend" can
          // re-submit the same email without the page needing its own
          // duplicate email state.
          onResend={() => {
            if (forgotPassword.variables) forgotPassword.mutate(forgotPassword.variables);
          }}
          isSubmitting={forgotPassword.isPending}
        />
      ) : (
        <ForgotPasswordForm forgotPassword={forgotPassword} />
      )}
    </AuthLayout>
  );
}
