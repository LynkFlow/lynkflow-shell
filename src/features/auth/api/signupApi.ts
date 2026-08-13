import { authHttp } from "./authHttp";
import type { SignupRequest } from "@lynkflow/types";

export const signupApi = {
  signup: (payload: SignupRequest) => authHttp.post<void>("/signup", payload),
};
