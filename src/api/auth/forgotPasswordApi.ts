import { authHttp } from "./authHttp";
import type { ForgotPasswordPayload } from "../../features/auth/auth.types";

export const forgotPasswordApi = {
  forgotPassword: (payload: ForgotPasswordPayload) =>
    authHttp.post<void>("/password/forgot", payload),
};
