export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: "uppercase", label: "At least 1 uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "At least 1 lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { id: "number", label: "At least 1 number", test: (pw) => /\d/.test(pw) },
  { id: "symbol", label: "At least 1 symbol", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  {
    id: "length",
    label: "At least 12 characters",
    test: (pw) => pw.length >= 12 && pw.length <= 128,
  },
];

export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}
