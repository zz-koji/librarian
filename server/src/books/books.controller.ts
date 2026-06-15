import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { GetBookQuerySchema, GetBooksQuerySchema } from './books.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  getBook(@Query() rawQuery: unknown) {
    const query = GetBookQuerySchema.parse(rawQuery);
    return this.books.getBook(query);
  }

  @Get('find')
  getBooks(@Query() rawQuery: unknown) {
    const query = GetBooksQuerySchema.parse(rawQuery);
    return this.books.getBooks(query);
  }
}
