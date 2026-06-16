import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  BookCoverResponse,
  BookCoverResponseSchema,
  SearchQuery,
  SearchResponse,
  SearchResponseSchema,
} from './open-library.schema';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { BookCatalogPort } from 'src/catalog/catalog.port';
import type {
  BookCoverResult,
  BooksSearchResult,
  CatalogSearchQuery,
  GetCoverParams,
} from 'src/catalog/catalog.schema';

@Injectable()
export class OpenLibraryAdapter implements BookCatalogPort {
  private readonly baseUrl: string;
  private readonly coverUrl: string;
  private readonly searchBooksFields = [
    'cover_i',
    'has_fulltext',
    'edition_count',
    'title',
    'author_name',
    'first_publish_year',
    'key',
    'ia',
    'author_key',
    'public_scan_b',
    'isbn',
  ].join(',');

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.getOrThrow('OPEN_LIBRARY_API_URL');
    this.coverUrl = this.config.getOrThrow('OPEN_LIBRARY_COVERS_API_URL');
  }

  async searchBooks(query: CatalogSearchQuery) {
    const params: SearchQuery = {
      title: query.title,
      author: query.author,
      subject: query.subject,
      fields: this.searchBooksFields,
    };

    const observable = this.httpService
      .get<unknown>(this.baseUrl + '/search.json', {
        params,
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
        isbn: book.isbn,
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
