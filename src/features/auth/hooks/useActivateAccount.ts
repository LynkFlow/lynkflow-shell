import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { authClient } from "../../../api/authClient";
import type { AuthApiRequestError } from "../../../api/authClient";
import type { ActivationDetails, CompleteActivationPayload } from "../auth.types";

type Step = "loading" | "form" | "success" | "tokenError";

/**
 * Corrected against the reference implementation, not a straight port: that
 * version's `useActivateAccount` called `completeActivation` immediately on
 * mount with a hardcoded password-less payload, which meant
 * `ActivateAccountForm` (password + terms/privacy checkboxes) was built but
 * never actually reachable -- `validateActivation` (which returns the
 * `ActivationDetails` that form needs to render the account's email/terms
 * version) was never called either. This wires the two together the way
 * `auth.types.ts`'s own `CompleteActivationPayload` shape implies:
 * validate the token first, show the real form, submit it for real.
 */
export function useActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [step, setStep] = useState<Step>("loading");
  const [details, setDetails] = useState<ActivationDetails | null>(null);
  const [tokenError, setTokenError] = useState<AuthApiRequestError | null>(null);

  useEffect(() => {
    let cancelled = false;
    authClient
      .validateActivation(token)
      .then((result) => {
        if (!cancelled) {
          setDetails(result);
          setStep("form");
        }
      })
      .catch((err: AuthApiRequestError) => {
        if (!cancelled) {
          setTokenError(err);
          setStep("tokenError");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const completeActivation = useMutation<
    void,
    AuthApiRequestError,
    Omit<CompleteActivationPayload, "token">
  >({
    mutationFn: (payload) => authClient.completeActivation({ token, ...payload }),
    onSuccess: () => setStep("success"),
  });

  return { step, details, tokenError, completeActivation };
}
