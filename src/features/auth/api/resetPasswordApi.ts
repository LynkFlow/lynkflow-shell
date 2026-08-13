import { authHttp } from "./authHttp";
import type { ResetPasswordPayload } from "../types/auth.types";

export const resetPasswordApi = {
  validateResetToken: (token: string) =>
    authHttp.post<void>("/password/reset/validate", { token }),
  resetPassword: (payload: ResetPasswordPayload) =>
    authHttp.post<void>("/password/reset", payload),
};
