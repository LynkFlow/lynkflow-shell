import { authHttp } from "./authHttp";
import type { ForgotPasswordRequest } from "@lynkflow/types";

export const forgotPasswordApi = {
  forgotPassword: (payload: ForgotPasswordRequest) => authHttp.post<void>("/password/forgot", payload),
};
