import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SearchResponse, SearchResponseSchema } from './open-library.schema';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { BookCatalogPort } from 'src/catalog/catalog.port';
import type { BooksSearchResult, GetBooksQuery } from 'src/books/books.schema';

@Injectable()
export class OpenLibraryAdapter implements BookCatalogPort {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.getOrThrow('OPEN_LIBRARY_API_URL');
  }

  async searchBooks(query: GetBooksQuery) {
    const observable = this.httpService
      .get<unknown>(this.baseUrl + '/search.json', {
        params: {
          title: query.title,
        },
      })
      .pipe(map((response) => response.data));

    const rawResponse = await firstValueFrom(observable);
    const parsedResponse = SearchResponseSchema.parse(rawResponse);
    return this.transformSearchBooksResponse(parsedResponse);
  }

  private transformSearchBooksResponse(response: SearchResponse): BooksSearchResult[] {
    return response.docs.map((book) => {
      return {
        authors: book.author_name,
        coverId: book.cover_i,
        externalId: book.key,
        firstPublishYear: book.first_publish_year,
        title: book.title,
        source: 'OpenLibrary',
      };
    });
  }
}
