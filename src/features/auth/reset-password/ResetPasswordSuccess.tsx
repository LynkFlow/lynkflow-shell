import { useNavigate } from "react-router-dom";
import { Button } from "@lynkflow/ui-kit";

import successIcon from "../../../assets/success.svg";

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <img src={successIcon} alt="" className="w-15" />
      </div>

      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Password reset successfully
      </h1>
      <p className="mb-8 text-sm text-neutral-900 sm:text-base">
        Your password has been updated, you can log in with your new password.
      </p>

      <Button type="button" onClick={() => void navigate("/login")} className="w-full">
        Back to login
      </Button>
    </div>
  );
}
