import { useMutation } from "@tanstack/react-query";

import { authClient } from "../../../api/authClient";
import type { AuthApiRequestError } from "../../../api/authClient";
import type { ForgotPasswordPayload } from "../auth.types";

export function useForgotPassword() {
  return useMutation<void, AuthApiRequestError, ForgotPasswordPayload>({
    mutationFn: (payload) => authClient.forgotPassword(payload),
  });
}
