import { authHttp } from "./authHttp";
import type { LoginPayload, LoginResult } from "../types/auth.types";

export const loginApi = {
  login: (payload: LoginPayload) => authHttp.post<LoginResult>("/login", payload),
};
