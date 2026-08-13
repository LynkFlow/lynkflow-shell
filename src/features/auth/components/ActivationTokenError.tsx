import { Link } from "react-router-dom";

import { Banner } from "../../../components/Banner";
import { authErrorPresentation } from "../constants/errorMessages";
import type { AuthApiRequestError } from "../api/authHttp";

interface ActivationTokenErrorProps {
  error: AuthApiRequestError;
}

// Unlike a reset-password link, there's no self-serve "send me a new one"
// here -- only an admin can issue a new activation token -- so this just
// explains the problem and points back to Login rather than offering a retry.
export default function ActivationTokenError({ error }: ActivationTokenErrorProps) {
  const presentation = authErrorPresentation[error.code];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Activate your account
      </h1>

      <Banner
        variant={presentation?.variant ?? "error"}
        title={presentation?.title ?? "Something went wrong"}
        message={error.message ?? presentation?.message ?? "Please try again."}
        {...(error.details !== undefined && { details: error.details })}
      />

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:underline"
      >
        ← Back to Login
      </Link>
    </>
  );
}
