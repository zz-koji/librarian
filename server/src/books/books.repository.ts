import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB_CONNECTION } from 'src/database/database.tokens';
import { DB } from 'src/database/db.types';
import { CreateBookBody, GetBookQuery, GetBooksQuery, UpdateBookBody } from './books.schema';

@Injectable()
export class BooksRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) {}

  createBook(body: CreateBookBody) {
    return this.db.insertInto('books').values(body).returningAll().executeTakeFirst();
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
