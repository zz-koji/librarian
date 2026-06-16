import { z } from 'zod';

export const CatalogGetBookQuerySchema = z.object({
  externalId: z.string().min(1),
});

export type CatalogGetBookQuery = z.infer<typeof CatalogGetBookQuerySchema>;

export const CatalogSearchQuerySchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
});

export type CatalogSearchQuery = z.infer<typeof CatalogSearchQuerySchema>;

export const GetCoverParamsSchema = z.object({
  coverId: z.coerce.number(),
});

export type GetCoverParams = z.infer<typeof GetCoverParamsSchema>;

export const BookCoverResultSchema = z.object({
  externalId: z.number(),
  imageUrl: z.string(),
  width: z.number().nullish(),
  height: z.number().nullish(),
});

export type BookCoverResult = z.infer<typeof BookCoverResultSchema>;

export const BooksSearchResultSchema = z.object({
  externalId: z.string(),
  title: z.string(),
  authors: z.array(z.string()).nullish(),
  coverId: z.number().nullish(),
  firstPublishYear: z.number().nullish(),
  source: z.string(),
  isbn: z.string(),
});

export type BooksSearchResult = z.infer<typeof BooksSearchResultSchema>;
