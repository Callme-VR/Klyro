import { z } from "zod";

export const CreateSectionSchema = z.object({
  title: z
    .string({ message: "Section title required" })
    .min(1, "Section title cannot be empty")
    .max(100, "Section title cannot exceed 100 characters")
    .transform((val) => val.trim()),
  order: z.number().optional(),
});

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;

export const UpdateSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Section title cannot be empty")
    .max(100, "Section title cannot exceed 100 characters")
    .transform((val) => val.trim())
    .optional(),
  order: z.number().optional(),
});

export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;
