import { Injectable } from '@nestjs/common';
import { GetBookQuery, GetBooksQuery } from './books.schema';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly repo: BooksRepository) {}

  async getBook(query: GetBookQuery) {
    return this.repo.getBook(query);
  }

  async getBooks(query: GetBooksQuery) {
    return this.repo.getBooks(query);
  }
}
