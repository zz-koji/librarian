import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB_CONNECTION } from 'src/database/database.tokens';
import { DB } from 'src/database/db.types';
import { GetBookQuery, GetBooksQuery } from './books.schema';

@Injectable()
export class BooksRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) {}

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
