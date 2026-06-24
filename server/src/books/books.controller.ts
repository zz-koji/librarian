import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookSchema, GetBookQuerySchema, GetBooksQuerySchema } from './books.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) { }

  @Post()
  createBook(@Body() rawData: unknown) {
    const data = CreateBookSchema.parse(rawData);
    return this.books.createBook(data);
  }

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
