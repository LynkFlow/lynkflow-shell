export {
  createApiClient,
  ApiRequestError,
} from "./httpClient";
export type { ApiClient } from "./httpClient";
// `ApiError` now lives in @lynkflow/types, not this module -- re-export it
// from here too so existing `from "../../lib/http"` call sites don't need
// to know it moved to a shared package.
export type { ApiError } from "@lynkflow/types";
