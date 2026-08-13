import { useNavigate } from "react-router-dom";
import { Button } from "@lynkflow/ui-kit";

import successIcon from "../../../assets/success.svg";

export default function ActivationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <img src={successIcon} alt="" className="w-15" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Account activated
      </h1>
      <p className="mb-8 text-sm text-neutral-500 sm:text-base">
        Your account is ready. You can now sign in to LynkFlow.
      </p>

      <Button type="button" onClick={() => void navigate("/login")} className="w-full">
        Sign in
      </Button>
    </div>
  );
}
