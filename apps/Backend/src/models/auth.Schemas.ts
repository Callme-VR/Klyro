import { z } from "zod";

export const SignupSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string({ message: "Password is required" })
    .min(7, "Password must be at least 7 characters long"),
  name: z.string().min(4, "Name must be at least 4 characters long").optional(),
  avatarUrl: z.string().url("Invalid URL for avatar").optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const SigninSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export type SigninInput = z.infer<typeof SigninSchema>;
