import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  BookCoverResponse,
  BookCoverResponseSchema,
  SearchResponse,
  SearchResponseSchema,
} from './open-library.schema';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { BookCatalogPort } from 'src/catalog/catalog.port';
import type {
  BookCoverResult,
  BooksSearchResult,
  GetBooksQuery,
  GetCoverParams,
} from 'src/books/books.schema';

@Injectable()
export class OpenLibraryAdapter implements BookCatalogPort {
  private readonly baseUrl: string;
  private readonly coverUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.getOrThrow('OPEN_LIBRARY_API_URL');
    this.coverUrl = this.config.getOrThrow('OPEN_LIBRARY_COVERS_API_URL');
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

  async getCover(params: GetCoverParams) {
    const observable = this.httpService
      .get<unknown>(this.coverUrl + `/b/id/${params.coverId.toString()}.json`)
      .pipe(map((response) => response.data));

    const rawResponse = await firstValueFrom(observable);
    const parsedResponse = BookCoverResponseSchema.parse(rawResponse);
    return this.transformBookCoverResponse(parsedResponse);
  }

  private transformBookCoverResponse(response: BookCoverResponse): BookCoverResult {
    return {
      externalId: response.id,
      imageUrl: response.source_url,
      height: response.height,
      width: response.width,
    };
  }
}
