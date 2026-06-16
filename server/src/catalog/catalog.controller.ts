import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetBooksQuerySchema, GetCoverParamsSchema } from 'src/books/books.schema';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}
  @Get()
  searchBooks(@Query() rawQuery: unknown) {
    const query = GetBooksQuerySchema.parse(rawQuery);
    return this.catalogService.searchBooks(query);
  }

  @Get('covers/:coverId')
  getCover(@Param() rawParams: unknown) {
    const params = GetCoverParamsSchema.parse(rawParams);
    return this.catalogService.getCover(params);
  }
}
