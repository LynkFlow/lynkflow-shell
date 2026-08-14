import { useMutation } from "@tanstack/react-query";

import { loginApi } from "../api/loginApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { LoginRequest } from "@lynkflow/types";

export function useLogin() {
  return useMutation<void, AuthApiRequestError, LoginRequest>({
    mutationFn: async (payload) => {
      await loginApi.login(payload);
      // No post-login dashboard yet -- full navigation, not React Router.
      window.location.assign("/");
    },
  });
}
