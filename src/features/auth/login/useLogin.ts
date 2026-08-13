import { useMutation } from "@tanstack/react-query";

import { loginApi } from "../../../api/auth/loginApi";
import type { AuthApiRequestError } from "../../../api/auth/authHttp";
import type { LoginPayload } from "../auth.types";

/**
 * TanStack Query mutation, per .claude/rules/api-conventions.md ("use a
 * query/cache library for server state ... rather than hand-rolled
 * useEffect + local useState fetch logic"). The reference implementation
 * this was migrated from used raw useState for isSubmitting/error -- this
 * replaces that with useMutation's own isPending/error, same behavior, less
 * hand-rolled state.
 */
export function useLogin() {
  return useMutation<void, AuthApiRequestError, LoginPayload>({
    mutationFn: async (payload) => {
      await loginApi.login(payload);
      // The landing page belongs to the Shell, but there's nothing to land
      // on yet (no post-login dashboard built -- .claude/rules/progress.md).
      // A full document navigation, not React Router, since a real session
      // landing page may eventually live outside this SPA's own route tree.
      window.location.assign("/");
    },
  });
}
