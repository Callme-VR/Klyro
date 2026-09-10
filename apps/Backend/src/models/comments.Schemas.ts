import { z } from "zod";

// ============================================================
// Comment Schemas
// ============================================================

export const CreateCommentSchema = z.object({
  content: z
    .string({ message: "Comment content is required" })
    .min(1, "Comment content cannot be empty")
    .transform((val) => val.trim()),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  content: z
    .string({ message: "Comment content is required" })
    .min(1, "Comment content cannot be empty")
    .transform((val) => val.trim()),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;