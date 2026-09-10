import { z } from "zod";
// ============================================================
// Issue Schemas
// ============================================================
export const CreateIssueSchema = z.object({
  title: z
    .string({ message: "Issue title is required" })
    .min(1, "Issue title cannot be empty")
    .max(255, "Issue title cannot exceed 255 characters")
    .transform((val) => val.trim()),
  description: z.string().nullable().optional(),
  order: z.number().optional(),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO date string" })
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
});
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export const UpdateIssueSchema = z.object({
  title: z
    .string()
    .min(1, "Issue title cannot be empty")
    .max(255, "Issue title cannot exceed 255 characters")
    .transform((val) => val.trim())
    .optional(),
  description: z.string().nullable().optional(),
  order: z.number().optional(),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO date string" })
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
  sectionId: z.string().uuid({ message: "Invalid target section ID" }).optional(),
});
export type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;



// ============================================================
// Issue Assignee Schemas
// ============================================================
export const AddAssigneeSchema = z.object({
  userId: z.string({ message: "userId is required" }).uuid("Invalid user ID"),
});
export type AddAssigneeInput = z.infer<typeof AddAssigneeSchema>;
