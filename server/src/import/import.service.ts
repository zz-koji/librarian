import { Injectable } from '@nestjs/common';
import { BooksRepository } from 'src/books/books.repository';
import { ImportBookBody } from './import.schema';
import { CatalogService } from 'src/catalog/catalog.service';

@Injectable()
export class ImportService {
  constructor(private readonly catalogService: CatalogService, private readonly books: BooksRepository) { }

  async importBook(importBody: ImportBookBody) {
    const catalogEntry = await this.catalogService.getBook(importBody);

    const inserted = await this.books.insertImportedBook({
      title: catalogEntry.title,
      isbn: catalogEntry.isbn,
      source: catalogEntry.source,
      external_id: catalogEntry.externalId,
    });

    if (!inserted) {
      return this.books.getImportedBook(catalogEntry.source, catalogEntry.externalId);
    }

    return inserted;
  }
}
