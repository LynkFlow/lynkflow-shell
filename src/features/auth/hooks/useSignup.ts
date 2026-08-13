import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { signupApi } from "../api/signupApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { SignupPayload } from "../types/auth.types";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation<void, AuthApiRequestError, SignupPayload>({
    mutationFn: (payload) => signupApi.signup(payload),
    onSuccess: () => {
      void navigate("/login");
    },
  });
}
