import z from 'zod';

export const SearchQuerySchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  subject: z.string().optional(),
  fields: z.string(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const SearchResponseBookSchema = z.object({
  cover_i: z.number().nullish(),
  has_fulltext: z.boolean(),
  edition_count: z.number(),
  title: z.string(),
  author_name: z.array(z.string()).nullish(),
  first_publish_year: z.number().nullish(),
  key: z.string(),
  ia: z.array(z.string()).nullish(),
  author_key: z.array(z.string()).nullish(),
  public_scan_b: z.boolean().nullish(),
  isbn: z.array(z.string()),
});

export type SearchResponseDoc = z.infer<typeof SearchResponseBookSchema>;

export const SearchResponseSchema = z.object({
  start: z.number(),
  num_found: z.number(),
  docs: z.array(SearchResponseBookSchema),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const GetBookResponseSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).nullish(),
  publish_date: z.coerce.date().nullish(),
  covers: z.array(z.number()).nullish().transform((coverIds) => {
    if (!coverIds) {
      return null;
    }
    return coverIds[0];
  }),
  isbn_10: z.array(z.string()).nullish(),
  isbn_13: z.array(z.string()).nullish(),
});

export type GetBookResponse = z.infer<typeof GetBookResponseSchema>;

export const BookCoverResponseSchema = z.object({
  id: z.number(),
  source_url: z.string(),
  width: z.number(),
  height: z.number(),
  olid: z.string(),
});

export type BookCoverResponse = z.infer<typeof BookCoverResponseSchema>;
