import { authHttp } from "./authHttp";
import type { LoginRequest, LoginResponse } from "@lynkflow/types";

export const loginApi = {
  login: (payload: LoginRequest) => authHttp.post<LoginResponse>("/login", payload),
};
