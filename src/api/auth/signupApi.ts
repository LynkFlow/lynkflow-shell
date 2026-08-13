import { authHttp } from "./authHttp";
import type { SignupPayload } from "../../features/auth/auth.types";

export const signupApi = {
  signup: (payload: SignupPayload) => authHttp.post<void>("/signup", payload),
};
