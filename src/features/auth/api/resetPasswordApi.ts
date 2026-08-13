import { authHttp } from "./authHttp";
import type { ResetPasswordRequest, ValidateResetTokenRequest } from "@lynkflow/types";

export const resetPasswordApi = {
  validateResetToken: (token: string) =>
    authHttp.post<void>("/password/reset/validate", { token } satisfies ValidateResetTokenRequest),
  resetPassword: (payload: ResetPasswordRequest) =>
    authHttp.post<void>("/password/reset", payload),
};
