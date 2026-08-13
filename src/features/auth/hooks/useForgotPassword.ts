import { useMutation } from "@tanstack/react-query";

import { forgotPasswordApi } from "../api/forgotPasswordApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { ForgotPasswordRequest } from "@lynkflow/types";

export function useForgotPassword() {
  return useMutation<void, AuthApiRequestError, ForgotPasswordRequest>({
    mutationFn: (payload) => forgotPasswordApi.forgotPassword(payload),
  });
}
