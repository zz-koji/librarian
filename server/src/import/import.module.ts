import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { BooksModule } from 'src/books/books.module';
import { ImportController } from './import.controller';

@Module({
  imports: [BooksModule],
  providers: [ImportService],
  exports: [ImportService],
  controllers: [ImportController],
})
export class ImportModule {}
