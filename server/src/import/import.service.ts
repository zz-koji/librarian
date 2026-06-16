import { Injectable } from '@nestjs/common';
import { BooksRepository } from 'src/books/books.repository';
import { ImportBookBody } from './import.schema';
import { CatalogService } from 'src/catalog/catalog.service';

@Injectable()
export class ImportService {
  constructor(private readonly catalogService: CatalogService, private readonly books: BooksRepository) { }

  async importBook(importBody: ImportBookBody) {
    const catalogEntry = await this.catalogService.getBook(importBody);

    return this.books.insertImportedBook({
      title: catalogEntry.title,
      isbn: catalogEntry.isbn[0],
      source: catalogEntry.source,
      external_id: catalogEntry.externalId,
    });
  }
}
