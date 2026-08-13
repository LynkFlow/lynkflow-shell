import AuthLayout from "../components/AuthLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";
import CheckEmailNotice from "./CheckEmailNotice";
import { useForgotPassword } from "./useForgotPassword";

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
