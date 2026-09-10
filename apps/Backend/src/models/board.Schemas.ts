import { z } from "zod";

export const CreateBoardSchema = z.object({
  title: z
    .string({ message: "Board title is required" })
    .min(1, "Board title is required")
    .max(100, "Title cannot exceed 100 characters")
    .transform((val) => val.trim()),
  organizationId: z
    .string({ message: "Organization ID is required" })
    .uuid("Invalid organization ID"),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color (e.g. #0079BF)")
    .optional()
    .default("#0079BF"),
});
export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;

// Update Board Schema
export const UpdateBoardSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .transform((val) => val.trim())
    .optional(),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color")
    .optional(),
  isClosed: z.boolean().optional(),
});
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;