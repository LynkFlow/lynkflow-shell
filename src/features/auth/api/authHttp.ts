/**
 * Shared axios plumbing for every auth endpoint file in this folder. One
 * axios instance + one response interceptor that normalizes the backend's
 * envelope into `AuthApiRequestError`, so each endpoint just calls
 * `authHttp.post(...)` and gets back unwrapped data or a thrown error.
 *
 * Doesn't use `../httpClient.ts`'s `createApiClient` -- that assumes a
 * `{ message, fieldErrors? }` error shape that doesn't fit auth's contract.
 */
import axios from "axios";
import type { AxiosError } from "axios";

import type { AuthApiError, AuthErrorCode } from "@lynkflow/types";
import { env } from "../../../app/config";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    data?: unknown;
  };
}

export class AuthApiRequestError extends Error implements AuthApiError {
  code: AuthErrorCode;
  details?: string[];

  constructor(apiError: AuthApiError) {
    super(apiError.message ?? "Something went wrong. Please try again.");
    this.name = "AuthApiRequestError";
    this.code = apiError.code;
    if (apiError.details !== undefined) this.details = apiError.details;
  }
}

const client = axios.create({
  baseURL: env.authApiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function toAuthApiRequestError(error: AxiosError<ApiErrorBody>): AuthApiRequestError {
  if (!error.response) {
    // No response at all -- network failure, timeout, CORS, DNS, etc.
    return new AuthApiRequestError({
      code: "NETWORK_ERROR",
      message: "Couldn't reach the server. Please check your connection and try again.",
    });
  }

  const errorBody = error.response.data?.error;
  const code = (errorBody?.code ?? "NETWORK_ERROR") as AuthErrorCode;
  const details = Array.isArray(errorBody?.data)
    ? errorBody.data.filter((item): item is string => typeof item === "string")
    : undefined;

  return new AuthApiRequestError({
    code,
    ...(errorBody?.message !== undefined && { message: errorBody.message }),
    ...(details !== undefined && details.length > 0 && { details }),
  });
}

client.interceptors.response.use(
  // Every endpoint here calls authHttp.post/get expecting the unwrapped
  // payload, not the {success,data,message} envelope -- unwrap it once,
  // here, instead of every endpoint file repeating `res.data.data`.
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    return { ...response, data: envelope.data };
  },
  (error: AxiosError<ApiErrorBody>) => Promise.reject(toAuthApiRequestError(error)),
);

export const authHttp = {
  get: <T>(path: string) => client.get<T>(path).then((res) => res.data),
  post: <T>(path: string, body?: unknown) => client.post<T>(path, body).then((res) => res.data),
};
