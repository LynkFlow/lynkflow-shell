import { z } from "zod";

import { isPasswordValid } from "../constants/passwordPolicy";

export const signupFormSchema = z.object({
  accountType: z.enum(["real_estate_developer", "brokerage_company", "sales_agent"]),
  fullName: z.string().min(1, "Please complete all mandatory fields."),
  email: z
    .string()
    .min(1, "Please complete all mandatory fields.")
    .email("Please enter a valid email format."),
  company: z.string().min(1, "Please complete all mandatory fields."),
  password: z
    .string()
    .min(1, "Please complete all mandatory fields.")
    .refine(isPasswordValid, "Please choose a password that meets every requirement below."),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
