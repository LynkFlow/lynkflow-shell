import { useMutation } from "@tanstack/react-query";

import { forgotPasswordApi } from "../../../api/auth/forgotPasswordApi";
import type { AuthApiRequestError } from "../../../api/auth/authHttp";
import type { ForgotPasswordPayload } from "../auth.types";

export function useForgotPassword() {
  return useMutation<void, AuthApiRequestError, ForgotPasswordPayload>({
    mutationFn: (payload) => forgotPasswordApi.forgotPassword(payload),
  });
}
