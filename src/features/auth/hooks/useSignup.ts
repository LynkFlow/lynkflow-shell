import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authClient } from "../../../api/authClient";
import type { AuthApiRequestError } from "../../../api/authClient";
import type { SignupPayload } from "../auth.types";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation<void, AuthApiRequestError, SignupPayload>({
    mutationFn: (payload) => authClient.signup(payload),
    onSuccess: () => {
      void navigate("/login");
    },
  });
}
