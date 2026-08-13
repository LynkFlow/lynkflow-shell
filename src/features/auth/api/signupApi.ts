import { authHttp } from "./authHttp";
import type { SignupPayload } from "../types/auth.types";

export const signupApi = {
  signup: (payload: SignupPayload) => authHttp.post<void>("/signup", payload),
};
