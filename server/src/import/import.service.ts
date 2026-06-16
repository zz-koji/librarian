import { Injectable } from '@nestjs/common';
import { BooksRepository } from 'src/books/books.repository';
import { ImportBookBody } from './import.schema';

@Injectable()
export class ImportService {
  constructor(private readonly books: BooksRepository) { }

  importBook(book: ImportBookBody) {
    return this.books.insertImportedBook({
      title: book.title,
      isbn: book.isbn[0],
      source: book.source,
      external_id: book.externalId,
    });
  }
}
