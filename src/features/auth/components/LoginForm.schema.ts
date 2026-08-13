import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Please complete all mandatory fields.")
    .email("Please enter a valid email format."),
  password: z.string().min(1, "Please complete all mandatory fields."),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
