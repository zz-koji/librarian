import { Injectable } from '@nestjs/common';
import { CreateBookBody, GetBookQuery, GetBooksQuery, UpdateBookBody } from './books.schema';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly repo: BooksRepository) {}

  createBook(body: CreateBookBody) {
    return this.repo.createBook(body);
  }

  updateBook(body: UpdateBookBody, id: string) {
    return this.repo.updateBook(body, id);
  }

  deleteBook(id: string) {
    return this.repo.deleteBook(id);
  }

  getBook(query: GetBookQuery) {
    return this.repo.getBook(query);
  }

  getBooks(query: GetBooksQuery) {
    return this.repo.getBooks(query);
  }
}
