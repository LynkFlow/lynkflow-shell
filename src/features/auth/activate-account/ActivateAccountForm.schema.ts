import { z } from "zod";

import { isPasswordValid } from "../constants/passwordPolicy";

export const activateAccountFormSchema = z
  .object({
    password: z
      .string()
      .min(1, "Please complete all mandatory fields.")
      .refine(isPasswordValid, "Please choose a password that meets every requirement below."),
    confirmPassword: z.string().min(1, "Please complete all mandatory fields."),
    termsAccepted: z
      .boolean()
      .refine((value) => value, "Please complete all mandatory fields."),
    privacyPolicyAccepted: z
      .boolean()
      .refine((value) => value, "Please complete all mandatory fields."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ActivateAccountFormValues = z.infer<typeof activateAccountFormSchema>;
