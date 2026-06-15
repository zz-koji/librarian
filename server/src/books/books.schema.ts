import { z } from 'zod';

export const GetBookQuerySchema = z.object({
  id: z.uuid(),
});

export type GetBookQuery = z.infer<typeof GetBookQuerySchema>;

export const GetBooksQuerySchema = z.object({
  title: z.string().min(1).optional(),
});

export type GetBooksQuery = z.infer<typeof GetBooksQuerySchema>;
