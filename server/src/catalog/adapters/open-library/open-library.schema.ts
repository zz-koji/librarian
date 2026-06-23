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
  isbn: z.array(z.string()).optional(),
});

export type SearchResponseDoc = z.infer<typeof SearchResponseBookSchema>;

export const SearchResponseSchema = z.object({
  start: z.number(),
  num_found: z.number(),
  docs: z.array(SearchResponseBookSchema),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const GetBookCoverResponseSchema = z.object({
  small: z.string(),
  medium: z.string(),
  large: z.string(),
});

export const GetBookAuthorsResponseSchema = z.object({
  name: z.string(),
});

export const GetBookResponseSchema = z.object({
  title: z.string(),
  authors: z.array(GetBookAuthorsResponseSchema).nullish().transform((authors) => authors?.map((author) => author.name)),
  publish_date: z.coerce.date().nullish(),
  cover: GetBookCoverResponseSchema.nullish().transform((cover) => {
    if (!cover) {
      return null;
    }
    const match = cover.large.match(/\/b\/id\/(\d+)-/);
    return match ? Number(match[1]) : null;
  }),
  identifiers: z.object({
    isbn_10: z.array(z.string()).nullish(),
    isbn_13: z.array(z.string()).nullish(),
  }),
});

export const GetBookEnvelopeSchema = z.record(z.string(), GetBookResponseSchema);

export type GetBookEnvelope = z.infer<typeof GetBookEnvelopeSchema>;

export type GetBookResponse = z.infer<typeof GetBookResponseSchema>;

export const BookCoverResponseSchema = z.object({
  id: z.number(),
  source_url: z.string(),
  width: z.number(),
  height: z.number(),
  olid: z.string(),
});

export type BookCoverResponse = z.infer<typeof BookCoverResponseSchema>;
