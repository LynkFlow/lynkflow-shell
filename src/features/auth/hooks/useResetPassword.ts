import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { authClient } from "../../../api/authClient";
import type { AuthApiRequestError } from "../../../api/authClient";
import type { ResetPasswordPayload } from "../auth.types";

type TokenState = "checking" | "valid" | "invalid";

/**
 * Validates the reset token on mount (a query, not a mutation -- it's a
 * read, per api-conventions.md's TanStack-Query-for-server-state rule, just
 * not one worth wiring up `useQuery`'s full caching machinery for a
 * fire-once-on-mount check with no cache key anything else would share).
 */
export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [tokenError, setTokenError] = useState<AuthApiRequestError | null>(null);

  useEffect(() => {
    let cancelled = false;
    authClient
      .validateResetToken(token)
      .then(() => {
        if (!cancelled) setTokenState("valid");
      })
      .catch((err: AuthApiRequestError) => {
        if (!cancelled) {
          setTokenError(err);
          setTokenState("invalid");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const resetPassword = useMutation<
    void,
    AuthApiRequestError,
    Omit<ResetPasswordPayload, "token">
  >({
    mutationFn: (payload) => authClient.resetPassword({ token, ...payload }),
  });

  return { tokenState, tokenError, resetPassword };
}
