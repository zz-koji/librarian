import type { BooksSearchResult, GetBooksQuery } from 'src/books/books.schema';

export interface BookCatalogPort {
  searchBooks(query: GetBooksQuery): Promise<BooksSearchResult[]>;
  // getBook<T>(query: unknown): Promise<T>;
}
