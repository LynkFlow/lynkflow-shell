import type { AuthErrorCode } from "../types/auth.types";
import type { BannerVariant } from "../../../components/Banner";

interface ErrorPresentation {
  variant: BannerVariant;
  title: string;
  message?: string;
}

export const authErrorPresentation: Record<AuthErrorCode, ErrorPresentation> = {
  AUTH_INVALID_CREDENTIALS: {
    variant: "error",
    title: "Invalid email address or password.",
  },
  AUTH_ACCOUNT_LOCKED: {
    variant: "error",
    title: "Account Locked",
    message:
      "Your account has been locked due to multiple unsuccessful login attempts. Please try again later or reset your password.",
  },
  AUTH_ACCOUNT_SUSPENDED: {
    variant: "error",
    title: "Account Suspended",
    message: "This account has been suspended. Please contact your administrator.",
  },
  AUTH_ACCOUNT_NOT_ACTIVATED: {
    variant: "error",
    title: "Account not activated",
    message:
      "Your account has not been activated yet. Check your email for the activation link.",
  },
  AUTH_ACCOUNT_INACTIVE: {
    variant: "error",
    title: "Account inactive",
    message: "Your account is inactive. Please contact your administrator.",
  },
  AUTH_ACTIVATION_TOKEN_INVALID: {
    variant: "error",
    title: "Activation link is invalid",
    message:
      "This activation link is invalid. Please contact your administrator for a new one.",
  },
  AUTH_ACTIVATION_TOKEN_EXPIRED: {
    variant: "error",
    title: "Activation link expired",
    message:
      "This activation link has expired. Please contact your administrator for a new one.",
  },
  AUTH_ACCOUNT_ALREADY_ACTIVE: {
    variant: "warning",
    title: "Account already activated",
    message: "This account has already been activated. You can log in directly.",
  },
  AUTH_PASSWORD_RESET_TOKEN_INVALID: {
    variant: "error",
    title: "Password reset link is not valid",
    message:
      "This password reset link can no longer be used. Please request a new password reset link.",
  },
  AUTH_PASSWORD_RESET_TOKEN_EXPIRED: {
    variant: "error",
    title: "Reset link expired",
    message: "This password reset link has expired. Please request a new one.",
  },
  AUTH_PASSWORD_POLICY_VIOLATION: {
    variant: "error",
    title: "Password does not comply with the password policy",
    message: "Please enter a different password.",
  },
  AUTH_PASSWORD_UNCHANGED: {
    variant: "error",
    title: "Password cannot be reused",
    message: "Your new password cannot be the same as your current password.",
  },
  AUTH_SESSION_EXPIRED: {
    variant: "warning",
    title: "Your session has expired",
    message: "Please log in again to continue.",
  },
  AUTH_CURRENT_PASSWORD_INCORRECT: {
    variant: "error",
    title: "Current password is incorrect",
    message: "Please double-check and try again.",
  },
  NETWORK_ERROR: {
    variant: "error",
    title: "Couldn't reach the server",
    message: "Check your connection and try again.",
  },
  AUTH_EMAIL_ALREADY_REGISTERED: {
    variant: "error",
    title: "Email already in use",
    message: "An account already exists for this email address. Try signing in instead.",
  },
  PASSWORD_POLICY_VIOLATION: {
    variant: "error",
    title: "Password does not comply with the password policy",
    message: "Please enter a different password.",
  },
  AUTH_PASSWORD_RESET_RATE_LIMITED: {
    variant: "error",
    title: "Too many requests",
    message:
      "You have made too many requests in a short period of time. Please wait and try again later.",
  },
  AUTH_RATE_LIMITED: {
    variant: "error",
    title: "Too many requests",
    message:
      "You have made too many requests in a short period of time. Please wait and try again later.",
  },
  AUTH_CHANGE_PASSWORD_RATE_LIMITED: {
    variant: "error",
    title: "Too many requests",
    message:
      "You have made too many requests in a short period of time. Please wait and try again later.",
  },
  AUTH_ACTIVATION_RATE_LIMITED: {
    variant: "error",
    title: "Too many requests",
    message:
      "You have made too many requests in a short period of time. Please wait and try again later.",
  },
  VALIDATION_ERROR: {
    variant: "error",
    title: "Validation Error",
    message: "There was a validation error. Please check your input and try again.",
  },
};
