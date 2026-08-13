import { useMutation } from "@tanstack/react-query";

import { forgotPasswordApi } from "../api/forgotPasswordApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { ForgotPasswordPayload } from "../types/auth.types";

export function useForgotPassword() {
  return useMutation<void, AuthApiRequestError, ForgotPasswordPayload>({
    mutationFn: (payload) => forgotPasswordApi.forgotPassword(payload),
  });
}
