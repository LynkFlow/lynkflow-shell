import { Link } from "react-router-dom";

import mailIcon from "../../../assets/send.svg";

interface CheckEmailNoticeProps {
  onResend: () => void;
  isSubmitting: boolean;
}

export default function CheckEmailNotice({ onResend, isSubmitting }: CheckEmailNoticeProps) {
  return (
    <>
      <div className="mb-4 flex flex-row items-center gap-4">
        <img src={mailIcon} alt="" className="w-16" />
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Check your email
        </h1>
      </div>

      <p className="mb-8 text-sm text-neutral-500 sm:text-base">
        If the email address exists in our system, a password reset link has been sent.
      </p>

      <p className="text-center text-sm text-neutral-500">
        Didn't receive the email?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={isSubmitting}
          className="font-medium text-primary-500 hover:underline disabled:opacity-50"
        >
          Resend Link
        </button>
      </p>

      <Link
        to="/login"
        className="mt-8 flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:underline"
      >
        ← Back to Login
      </Link>
    </>
  );
}
