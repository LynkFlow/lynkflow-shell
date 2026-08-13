import { authHttp } from "./authHttp";
import type {
  ActivationDetails,
  CompleteActivationPayload,
} from "../../features/auth/auth.types";

export const activateAccountApi = {
  validateActivation: (token: string) =>
    authHttp.post<ActivationDetails>("/activation/validate", { token }),
  completeActivation: (payload: CompleteActivationPayload) =>
    authHttp.post<void>("/activation/complete", payload),
};
