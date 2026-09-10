import { z } from "zod";

// Create Organization Schema
export const CreateOrgSchema = z.object({
  name: z
    .string({ message: "Organization name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  slug: z
    .string({ message: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(30, "Slug cannot exceed 30 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .transform((val) => val.toLowerCase().trim()),
  description: z.string().max(250, "Description cannot exceed 250 characters").optional(),
  avatarUrl: z.string().url("Invalid URL format for avatar").optional(),
});

export type CreateOrgInput = z.infer<typeof CreateOrgSchema>;

// Update Organization Schema
export const UpdateOrgSchema = CreateOrgSchema.partial();
export type UpdateOrgInput = z.infer<typeof UpdateOrgSchema>;

// Invite Member Schema
export const CreateInviteSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format")
    .transform((val) => val.toLowerCase().trim()),
});

export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;

// Accept Invite Schema
export const AcceptInviteSchema = z.object({
  token: z.string({ message: "Invite token is required" }).min(1, "Token is required"),
});

export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
