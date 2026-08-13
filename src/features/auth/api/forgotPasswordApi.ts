import { authHttp } from "./authHttp";
import type { ForgotPasswordPayload } from "../types/auth.types";

export const forgotPasswordApi = {
  forgotPassword: (payload: ForgotPasswordPayload) =>
    authHttp.post<void>("/password/forgot", payload),
};
