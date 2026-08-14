import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { activateAccountApi } from "../api/activateAccountApi";
import type { AuthApiRequestError } from "../api/authHttp";
import type { CompleteActivationRequest, ValidateActivationResponse } from "@lynkflow/types";

type Step = "loading" | "form" | "success" | "tokenError";

/** Validates the activation token on mount, then lets the form submit `completeActivation`. */
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
