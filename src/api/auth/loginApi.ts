import { authHttp } from "./authHttp";
import type { LoginPayload, LoginResult } from "../../features/auth/auth.types";

export const loginApi = {
  login: (payload: LoginPayload) => authHttp.post<LoginResult>("/login", payload),
};
