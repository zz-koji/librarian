import type {
  BookCoverResult,
  BooksSearchResult,
  CatalogGetBookQuery,
  CatalogSearchQuery,
  GetCoverParams,
} from './catalog.schema';

export interface BookCatalogPort {
  searchBooks(query: CatalogSearchQuery): Promise<BooksSearchResult[]>;
  getBook(query: CatalogGetBookQuery): Promise<BooksSearchResult>;
  getCover(params: GetCoverParams): Promise<BookCoverResult>;
}
