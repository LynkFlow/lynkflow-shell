/**
 * Domain-agnostic HTTP client factory, built on axios.
 *
 * Per .claude/rules/api-conventions.md, a thin, domain-agnostic HTTP wrapper
 * (base URL, error-envelope normalization) is the one legitimate candidate for
 * the future `@lynkflow/api-client` platform package. This file is the local
 * stand-in until that package exists -- when it ships, this file's contents
 * move there largely unchanged.
 *
 * `src/features/auth/api/authHttp.ts` does not build on this factory -- the real auth
 * backend's response envelope doesn't fit the generic `{ message,
 * fieldErrors? }` shape this assumes; see that file's own header. This stays
 * here as the domain-agnostic baseline for any future Shell-owned API call
 * whose backend DOES return that shape.
 *
 * This file must stay domain-agnostic. The moment it grows a single
 * domain-specific type or endpoint, that logic belongs in the owning
 * `api/{domain}/{domain}Http.ts`, not here.
 */
import axios from "axios";
import type { AxiosError } from "axios";
import type { ApiError } from "@lynkflow/types";

// `ApiError` itself now lives in @lynkflow/types (src/api/api.types.ts) --
// it's genuine transport-level infrastructure, not this repo's own concern,
// so it belongs in the shared package alongside PaginatedResponse<T>
// (.claude/rules/architecture.md's @lynkflow/types section names both as
// the canonical "API infrastructure shapes" example). `ApiRequestError`
// stays local: it's a runtime `Error` subclass with real behavior, not a
// type, and @lynkflow/types ships types only (`sideEffects: false`, no
// runtime value -- see that package's own README).

/** Thrown by every request this client makes. Safe to `instanceof` check. */
export class ApiRequestError extends Error implements ApiError {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiRequestError";
    this.status = error.status;
    if (error.fieldErrors) this.fieldErrors = error.fieldErrors;
  }
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

/**
 * Creates an API client scoped to one domain's base URL.
 *
 * Services are expected to return a consistent error envelope
 * (`{ message, fieldErrors? }`); this falls back gracefully when they don't
 * (network errors, proxies, HTML error pages) rather than throwing an
 * unhelpful parse error.
 */
export function createApiClient(baseUrl: string): ApiClient {
  const client = axios.create({ baseURL: baseUrl });

  function toApiRequestError(error: AxiosError<Partial<ApiError>>): ApiRequestError {
    if (!error.response) {
      return new ApiRequestError({ status: 0, message: "Network error. Please try again." });
    }
    const body = error.response.data ?? {};
    return new ApiRequestError({
      status: error.response.status,
      message: body.message ?? `Request failed with status ${error.response.status}`,
      ...(body.fieldErrors ? { fieldErrors: body.fieldErrors } : {}),
    });
  }

  async function request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    path: string,
    body?: unknown,
  ): Promise<T> {
    try {
      const response = await client.request<T>({ method, url: path, data: body });
      return response.data;
    } catch (error) {
      throw toApiRequestError(error as AxiosError<Partial<ApiError>>);
    }
  }

  return {
    get: (path) => request("get", path),
    post: (path, body) => request("post", path, body),
    put: (path, body) => request("put", path, body),
    patch: (path, body) => request("patch", path, body),
    delete: (path) => request("delete", path),
  };
}
