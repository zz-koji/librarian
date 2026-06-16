import { Inject, Injectable } from '@nestjs/common';
import { BOOK_CATALOG_PORT } from './catalog.tokens';
import type { BookCatalogPort } from './catalog.port';
import { GetBooksQuery } from 'src/books/books.schema';

@Injectable()
export class CatalogService {
  constructor(@Inject(BOOK_CATALOG_PORT) private readonly catalog: BookCatalogPort) {}

  searchBooks(query: GetBooksQuery) {
    return this.catalog.searchBooks(query);
  }
}
