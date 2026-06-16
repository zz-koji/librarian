import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { BooksModule } from 'src/books/books.module';
import { ImportController } from './import.controller';
import { CatalogModule } from 'src/catalog/catalog.module';

@Module({
  imports: [BooksModule, CatalogModule],
  providers: [ImportService],
  exports: [ImportService],
  controllers: [ImportController],
})
export class ImportModule { }
