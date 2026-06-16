import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { DatabaseModule } from 'src/database/database.module';
import { BooksRepository } from './books.repository';
import { BooksController } from './books.controller';

@Module({
  imports: [DatabaseModule],
  providers: [BooksService, BooksRepository],
  controllers: [BooksController],
  exports: [BooksRepository],
})
export class BooksModule {}
