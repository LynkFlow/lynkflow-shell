import { Link, useNavigate } from "react-router-dom";
import { Button } from "@lynkflow/ui-kit";

import Banner from "./common/Banner";
import { authErrorPresentation } from "../constants/errorMessages";
import type { AuthApiRequestError } from "../../../api/authClient";

interface ResetPasswordErrorProps {
  error: AuthApiRequestError;
}

export default function ResetPasswordError({ error }: ResetPasswordErrorProps) {
  const navigate = useNavigate();
  const presentation = authErrorPresentation[error.code];

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Reset password
      </h1>

      <div className="space-y-4">
        <Banner
          variant={presentation?.variant ?? "error"}
          title={presentation?.title ?? "Something went wrong"}
          message={error.message ?? presentation?.message ?? "Please try again."}
        />
        <Button
          type="button"
          onClick={() => void navigate("/forgot-password")}
          className="w-full"
        >
          Request a new link
        </Button>
      </div>

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:underline"
      >
        ← Back to Login
      </Link>
    </>
  );
}
