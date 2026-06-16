import { z } from 'zod';
import { BooksSearchResultSchema } from 'src/catalog/catalog.schema';

export const ImportBookSchema = BooksSearchResultSchema.extend({
  source: z.string().min(1),
  externalId: z.string().min(1),
  isbn: z.array(z.string()).nonempty('At least one ISBN is required to import a book'),
});

export type ImportBookBody = z.infer<typeof ImportBookSchema>;
