import { authHttp } from "./authHttp";
import type {
  CompleteActivationRequest,
  ValidateActivationRequest,
  ValidateActivationResponse,
} from "@lynkflow/types";

export const activateAccountApi = {
  validateActivation: (token: string) =>
    authHttp.post<ValidateActivationResponse>("/activation/validate", {
      token,
    } satisfies ValidateActivationRequest),
  completeActivation: (payload: CompleteActivationRequest) =>
    authHttp.post<void>("/activation/complete", payload),
};
