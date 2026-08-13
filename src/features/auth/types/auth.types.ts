export type AuthErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_ACCOUNT_LOCKED"
  | "AUTH_ACCOUNT_SUSPENDED"
  | "AUTH_ACCOUNT_NOT_ACTIVATED"
  | "AUTH_ACCOUNT_INACTIVE"
  | "AUTH_ACTIVATION_TOKEN_INVALID"
  | "AUTH_ACTIVATION_TOKEN_EXPIRED"
  | "AUTH_ACCOUNT_ALREADY_ACTIVE"
  | "AUTH_PASSWORD_RESET_TOKEN_INVALID"
  | "AUTH_PASSWORD_RESET_TOKEN_EXPIRED"
  | "AUTH_PASSWORD_POLICY_VIOLATION"
  | "AUTH_PASSWORD_UNCHANGED"
  | "AUTH_SESSION_EXPIRED"
  | "AUTH_CURRENT_PASSWORD_INCORRECT"
  | "AUTH_RATE_LIMITED"
  | "NETWORK_ERROR"
  | "PASSWORD_POLICY_VIOLATION"
  | "AUTH_PASSWORD_RESET_RATE_LIMITED"
  | "AUTH_CHANGE_PASSWORD_RATE_LIMITED"
  | "AUTH_ACTIVATION_RATE_LIMITED"
  | "AUTH_EMAIL_ALREADY_REGISTERED"
  | "VALIDATION_ERROR";

/**
 * This domain's own error shape, distinct from lib/http/httpClient.ts's
 * generic `ApiError` -- see features/auth/api/authHttp.ts's header for why.
 * `code` drives which
 * message/variant `Banner` renders (constants/errorMessages.ts); `message`/
 * `details` are optional overrides the backend can supply on top of that
 * default presentation.
 */
export interface AuthApiError {
  code: AuthErrorCode;
  message?: string;
  details?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  user: AuthUser;
  session: {
    expiresAt: string;
  };
}

export type SignupRole = "real_estate_developer" | "brokerage_company" | "sales_agent";

export interface SignupPayload {
  fullName: string;
  email: string;
  company: string;
  password: string;
  accountType: SignupRole;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActivationDetails {
  account: {
    organizationName: string | null;
    fullName: string | null;
    email: string;
  };
  agreements: {
    termsVersion: string;
    privacyPolicyVersion: string;
  };
  expiresAt: string;
}

export interface CompleteActivationPayload {
  token: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  privacyPolicyAccepted?: boolean;
}
