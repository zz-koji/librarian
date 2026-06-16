import type {
  BookCoverResult,
  BooksSearchResult,
  CatalogSearchQuery,
  GetCoverParams,
} from './catalog.schema';

export interface BookCatalogPort {
  searchBooks(query: CatalogSearchQuery): Promise<BooksSearchResult[]>;
  getCover(params: GetCoverParams): Promise<BookCoverResult>;
  // getBook<T>(query: unknown): Promise<T>;
}
