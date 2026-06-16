import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BooksModule, DatabaseModule, CatalogModule],
  controllers: [],
})
export class AppModule {}
