import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  BookCoverResponse,
  BookCoverResponseSchema,
  GetBookEnvelopeSchema,
  GetBookResponse,
  GetBookResponseSchema,
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
  CatalogGetBookQuery,
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
        isbn: this.resolveSearchBooksIsbn(book.isbn),
      };
    });
  }

  private resolveSearchBooksIsbn(isbns: string[]): string {
    if (isbns && isbns.length > 0) {
      return isbns[0];
    }

    return '';
  }

  async getBook(query: CatalogGetBookQuery) {
    const bibkey = `OLID:${query.externalId}`;
    const observable = this.httpService.get<unknown>(this.baseUrl + `/api/books`, {
      params: { bibkeys: bibkey, format: 'json', jscmd: 'data' },
    }).pipe(map((response) => response.data));

    const rawResponse = await firstValueFrom(observable);
    const envelope = GetBookEnvelopeSchema.parse(rawResponse);
    const book = envelope[bibkey];
    if (!book) {
      throw new NotFoundException(`No catalog entry for ${query.externalId}`);
    }
    return this.transformGetBookResponse(book, query.externalId);
  }

  private async transformGetBookResponse(response: GetBookResponse, externalId: string): Promise<BooksSearchResult> {
    return {
      authors: response.authors,
      coverId: response.cover,
      isbn: this.resolveGetBookIsbn(response.identifiers.isbn_10, response.identifiers.isbn_13),
      externalId: externalId,
      firstPublishYear: response.publish_date?.getFullYear(),
      title: response.title,
      source: 'OpenLibrary',
    };
  }

  private resolveGetBookIsbn(isbn10: string[] | null | undefined, isbn13: string[] | null | undefined): string {
    if (isbn13 && isbn13.length > 0) {
      return isbn13[0];
    }

    if (isbn10 && isbn10.length > 0) {
      return isbn10[0];
    }

    return '';
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
