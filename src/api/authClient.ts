/**
 * Domain-owned API client for the Shell's own auth screens
 * (.claude/rules/api-conventions.md -- domain-specific client code lives in
 * the repo that owns it, never a shared cross-domain package).
 *
 * Deliberately does NOT build on ./httpClient.ts's `createApiClient`. That
 * factory assumes a `{ message, fieldErrors? }` error envelope; the auth
 * backend's actual contract (inherited unchanged from the reference
 * implementation this was migrated from) is `{ success, data?, message? }`
 * on success and `{ error: { code, message, data } }` on failure -- a
 * machine-readable `code` per api-conventions.md's spirit ("normalize every
 * -svc error response into one consistent shape at the API-client
 * boundary"), just a differently-shaped one than httpClient.ts's generic
 * assumption. Building a second, incompatible envelope INTO the shared
 * factory would make it not-domain-agnostic anymore (api-conventions.md
 * explicitly warns against that), so this file implements its own thin
 * `request()` instead -- normalized at this boundary, same as the rule asks,
 * just not reusing the generic factory's specific shape.
 *
 * No real backend exists yet (.claude/rules/progress.md) -- this is
 * scaffolding against the contract the reference implementation assumed.
 */
import type {
  ActivationDetails,
  AuthApiError,
  AuthErrorCode,
  CompleteActivationPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResult,
  ResetPasswordPayload,
  SignupPayload,
} from "../features/auth/auth.types";
import { env } from "../env";

const AUTH_API_BASE_URL = env.authApiBaseUrl;

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

async function throwAuthApiError(res: Response): Promise<never> {
  const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
  const errorBody = body.error;
  const code = (errorBody?.code ?? "NETWORK_ERROR") as AuthErrorCode;
  const details = Array.isArray(errorBody?.data)
    ? errorBody.data.filter((item): item is string => typeof item === "string")
    : undefined;

  throw new AuthApiRequestError({
    code,
    ...(errorBody?.message !== undefined && { message: errorBody.message }),
    ...(details !== undefined && details.length > 0 && { details }),
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${AUTH_API_BASE_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
      ...init,
    });
  } catch {
    throw new AuthApiRequestError({
      code: "NETWORK_ERROR",
      message: "Couldn't reach the server. Please check your connection and try again.",
    });
  }

  if (!res.ok) await throwAuthApiError(res);

  const body = (await res.json()) as ApiEnvelope<T>;
  return body.data as T;
}

export const authClient = {
  login: (payload: LoginPayload) =>
    request<LoginResult>("/login", { method: "POST", body: JSON.stringify(payload) }),

  signup: (payload: SignupPayload) =>
    request<void>("/signup", { method: "POST", body: JSON.stringify(payload) }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<void>("/password/forgot", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  validateResetToken: (token: string) =>
    request<void>("/password/reset/validate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    request<void>("/password/reset", { method: "POST", body: JSON.stringify(payload) }),

  validateActivation: (token: string) =>
    request<ActivationDetails>("/activation/validate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  completeActivation: (payload: CompleteActivationPayload) =>
    request<void>("/activation/complete", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
