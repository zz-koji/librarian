import { Inject, Injectable } from '@nestjs/common';
import { BOOK_CATALOG_PORT } from './catalog.tokens';
import type { BookCatalogPort } from './catalog.port';
import { CatalogGetBookQuery, CatalogSearchQuery, GetCoverParams } from './catalog.schema';

@Injectable()
export class CatalogService {
  constructor(@Inject(BOOK_CATALOG_PORT) private readonly catalog: BookCatalogPort) { }

  searchBooks(query: CatalogSearchQuery) {
    return this.catalog.searchBooks(query);
  }

  getBook(query: CatalogGetBookQuery) {
    return this.catalog.getBook(query);
  }

  getCover(params: GetCoverParams) {
    return this.catalog.getCover(params);
  }
}
