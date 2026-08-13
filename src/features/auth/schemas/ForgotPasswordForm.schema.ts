import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, "Please complete all mandatory fields.")
    .email("Please enter a valid email format."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
