import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { activateAccountApi } from "../api/activateAccountApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { CompleteActivationRequest, ValidateActivationResponse } from "@lynkflow/types";

type Step = "loading" | "form" | "success" | "tokenError";

/**
 * Corrected against the reference implementation, not a straight port: that
 * version's `useActivateAccount` called `completeActivation` immediately on
 * mount with a hardcoded password-less payload, which meant
 * `ActivateAccountForm` (password + terms/privacy checkboxes) was built but
 * never actually reachable -- `validateActivation` (which returns the
 * `ValidateActivationResponse` that form needs to render the account's email/terms
 * version) was never called either. This wires the two together the way
 * `@lynkflow/types`' own `CompleteActivationRequest` shape implies:
 * validate the token first, show the real form, submit it for real.
 */
export function useActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [step, setStep] = useState<Step>("loading");
  const [details, setDetails] = useState<ValidateActivationResponse | null>(null);
  const [tokenError, setTokenError] = useState<AuthApiRequestError | null>(null);

  useEffect(() => {
    let cancelled = false;
    activateAccountApi
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
    Omit<CompleteActivationRequest, "token">
  >({
    mutationFn: (payload) => activateAccountApi.completeActivation({ token, ...payload }),
    onSuccess: () => setStep("success"),
  });

  return { step, details, tokenError, completeActivation };
}
