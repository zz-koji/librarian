import { z } from 'zod';
export const ImportBookSchema = z.object({
  externalId: z.string().min(1)
});

export type ImportBookBody = z.infer<typeof ImportBookSchema>;
