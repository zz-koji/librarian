import type {
  BookCoverResult,
  BooksSearchResult,
  GetBooksQuery,
  GetCoverParams,
} from 'src/books/books.schema';

export interface BookCatalogPort {
  searchBooks(query: GetBooksQuery): Promise<BooksSearchResult[]>;
  getCover(params: GetCoverParams): Promise<BookCoverResult>;
  // getBook<T>(query: unknown): Promise<T>;
}
