/**
 * Domain-agnostic HTTP client factory, built on axios. Local stand-in for
 * the future `@lynkflow/api-client` package (api-conventions.md).
 *
 * `authHttp.ts` doesn't use this -- the real auth backend's error envelope
 * doesn't fit the generic `{ message, fieldErrors? }` shape assumed here.
 */
import axios from "axios";
import type { AxiosError } from "axios";
import type { ApiError } from "@lynkflow/types";

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

/** Creates an API client scoped to one domain's base URL. */
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
