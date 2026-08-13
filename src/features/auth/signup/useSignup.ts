import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { signupApi } from "../../../api/auth/signupApi";
import type { AuthApiRequestError } from "../../../api/auth/authHttp";
import type { SignupPayload } from "../auth.types";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation<void, AuthApiRequestError, SignupPayload>({
    mutationFn: (payload) => signupApi.signup(payload),
    onSuccess: () => {
      void navigate("/login");
    },
  });
}
