import { z } from 'zod';

export const saveResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  // Assuming content can be any JSON object from a rich text editor or similar
  // For more specific validation, you'd define the structure of 'content' more deeply
  content: z.object({}).passthrough().optional().describe("The main content of the resume, typically a JSON object from a rich text editor."),
  template_id: z.string().uuid("Invalid template ID format").optional().nullable(),
});

// Schema for req.params if you need to validate an ID for getResumeById
export const getResumeByIdParamsSchema = z.object({
    id: z.string().uuid("Invalid resume ID format in URL parameter"),
});
