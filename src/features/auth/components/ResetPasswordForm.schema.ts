import { z } from "zod";

import { isPasswordValid } from "../constants/passwordPolicy";

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Please complete all mandatory fields.")
      .refine(isPasswordValid, "Please choose a password that meets every requirement below."),
    confirmPassword: z.string().min(1, "Please complete all mandatory fields."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
