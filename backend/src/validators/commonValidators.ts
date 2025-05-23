import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format. Must be a UUID." }),
});

// Optional: Schema for pagination query parameters if you want to centralize it
export const paginationQuerySchema = z.object({
  page: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
    message: "Page must be a number.",
  }).transform(val => val ? parseInt(val, 10) : undefined),
  limit: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
    message: "Limit must be a number.",
  }).transform(val => val ? parseInt(val, 10) : undefined),
});
