import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { DB_CONNECTION } from 'src/database/database.tokens';
import { Books, DB } from 'src/database/db.types';
import { CreateBookBody, GetBookQuery, GetBooksQuery, UpdateBookBody } from './books.schema';

@Injectable()
export class BooksRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) { }

  createBook(body: CreateBookBody) {
    return this.db.insertInto('books').values(body).returningAll().executeTakeFirst();
  }

  insertImportedBook(values: Insertable<Books>) {
    return this.db
      .insertInto('books')
      .values(values)
      .onConflict((oc) => oc.constraint('books_source_external_id')
        .doNothing())
      .returningAll()
      .executeTakeFirst();
  }

  getImportedBook(source: string, externalId: string) {
    return this.db.selectFrom('books')
      .selectAll()
      .where('source', '=', source)
      .where('external_id', '=', externalId)
      .executeTakeFirst();
  }

  updateBook(body: UpdateBookBody, id: string) {
    return this.db
      .updateTable('books')
      .set(body)
      .where('books.id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  deleteBook(id: string) {
    return this.db.deleteFrom('books').where('id', '=', id).returningAll().executeTakeFirst();
  }

  getBook(filters: GetBookQuery) {
    return this.db.selectFrom('books').selectAll().where('id', '=', filters.id).executeTakeFirst();
  }

  getBooks(filters: GetBooksQuery) {
    const query = this.db.selectFrom('books').selectAll().limit(100);

    if (filters.title) {
      return query.where('title', '=', filters.title).execute();
    }

    return query.execute();
  }
}
