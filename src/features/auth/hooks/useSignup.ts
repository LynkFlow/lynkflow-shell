import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { signupApi } from "../api/signupApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { SignupRequest } from "@lynkflow/types";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation<void, AuthApiRequestError, SignupRequest>({
    mutationFn: (payload) => signupApi.signup(payload),
    onSuccess: () => {
      void navigate("/login");
    },
  });
}
