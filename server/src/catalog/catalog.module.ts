import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CatalogService } from './catalog.service';
import { BOOK_CATALOG_PORT } from './catalog.tokens';
import { OpenLibraryAdapter } from './adapters/open-library/open-library.adapter';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CatalogController],
  providers: [CatalogService, { provide: BOOK_CATALOG_PORT, useClass: OpenLibraryAdapter }],
})
export class CatalogModule {}
