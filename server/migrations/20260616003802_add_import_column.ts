import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('books')
    .addColumn('source', 'text')
    .addColumn('external_id', 'text')
    .execute();
  await db.schema
    .alterTable('books')
    .addUniqueConstraint('books_source_external_id', ['source', 'external_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('books').dropConstraint('books_source_external_id').execute();
  await db.schema.alterTable('books').dropColumn('source').dropColumn('external_id').execute();
}
