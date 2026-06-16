import { z } from 'zod';

export const GetBookQuerySchema = z.object({
  id: z.uuid(),
});

export type GetBookQuery = z.infer<typeof GetBookQuerySchema>;

export const GetBooksQuerySchema = z.object({
  title: z.string().min(1).optional(),
});

export type GetBooksQuery = z.infer<typeof GetBooksQuerySchema>;

export const BooksSearchResultSchema = z.object({
  externalId: z.string(),
  title: z.string(),
  authors: z.array(z.string()).nullish(),
  coverId: z.number().nullish(),
  firstPublishYear: z.number().nullish(),
  source: z.string(),
});

export type BooksSearchResult = z.infer<typeof BooksSearchResultSchema>;

export const CreateBookSchema = z.object({
  title: z.string().min(1),
  isbn: z.string().regex(/^(?:\d[- ]?){9}[\dX]$|^(?:\d[- ]?){12}\d$/, 'Invalid ISBN'),
});

export type CreateBookBody = z.infer<typeof CreateBookSchema>;

export const UpdateBookSchema = CreateBookSchema.partial();

export type UpdateBookBody = z.infer<typeof UpdateBookSchema>;
