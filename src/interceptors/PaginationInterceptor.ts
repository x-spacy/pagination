import { Request } from 'express';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';

import { map } from 'rxjs/operators';

import { Page } from '@x-spacy/pagination/schemas/Page';
import { PaginatedResponse } from '@x-spacy/pagination/schemas/PaginatedResponse';
import { PaginationLink } from '@x-spacy/pagination/schemas/PaginationLink';
import { PaginationMeta } from '@x-spacy/pagination/schemas/PaginationMeta';
import { PaginationOptions } from '@x-spacy/pagination/schemas/PaginationOptions';

import { PaginationLinkTypeEnum } from '@x-spacy/pagination/enums/PaginationLinkTypeEnum';
import { PaginationStrategyEnum } from '@x-spacy/pagination/enums/PaginationStrategyEnum';

import { encodeCursor } from '@x-spacy/pagination/utils/cursor';

@Injectable()
export class PaginateInterceptor<T> implements NestInterceptor<Page<T>, PaginatedResponse<T>> {
  public constructor(
    private readonly options: PaginationOptions = { strategy: PaginationStrategyEnum.OFFSET }
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler<Page<T>>) {
    const request = context.switchToHttp().getRequest<Request>();

    const perPage = Math.min(100, Math.max(1, parseInt(request.query.perPage as string, 10) || 10));

    const path = `${request.protocol}://${request.get('host') + request.path}`;

    return next.handle().pipe(map((data) => {
      if (!(data instanceof Page)) {
        return data;
      }

      if (this.options.strategy === PaginationStrategyEnum.CURSOR) {
        return this.buildCursor(request, path, perPage, data);
      }

      return this.buildOffset(request, path, perPage, data);
    }));
  }

  protected buildOffset(request: Request, path: string, perPage: number, data: Page<T>) {
    const { total, items } = data;

    const page = Math.max(1, parseInt(request.query.page as string, 10) || 1);

    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(page, lastPage);

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, total);

    const from = total > 0 ? startIndex + 1 : 0;
    const to = endIndex;

    const buildUrl = (pageNumber: number): string => `${path}?page=${pageNumber}&perPage=${perPage}`;

    const links = this.buildOffsetLinks(currentPage, lastPage, buildUrl);

    return new PaginatedResponse(
      items,
      new PaginationMeta(
        from,
        to,
        currentPage,
        lastPage,
        perPage,
        total
      ),
      path,
      buildUrl(1),
      currentPage > 1 ? buildUrl(currentPage - 1) : null,
      currentPage < lastPage ? buildUrl(currentPage + 1) : null,
      buildUrl(lastPage),
      links
    );
  }

  protected buildCursor(request: Request, path: string, perPage: number, data: Page<T>) {
    const { total, items } = data;

    const cursorKey = this.options.cursorKey;

    if (!cursorKey) {
      throw new Error('PaginateInterceptor: "cursorKey" is required when strategy is CURSOR');
    }

    const hasItems = items.length > 0;
    const hasMore = items.length === perPage;

    const requestCursor = request.query.cursor as string | undefined;

    const nextCursor = hasItems
      ? encodeCursor((items[items.length - 1] as Record<string, unknown>)[cursorKey] as string | number)
      : null;
    const previousCursor = requestCursor && hasItems
      ? encodeCursor((items[0] as Record<string, unknown>)[cursorKey] as string | number)
      : null;

    const lastPage = Math.max(1, Math.ceil(total / perPage));

    const firstPageURL = `${path}?perPage=${perPage}`;
    const buildUrl = (cursor: string): string => `${path}?cursor=${cursor}&perPage=${perPage}`;

    const previousPageURL = previousCursor ? buildUrl(previousCursor) : null;
    const nextPageURL = hasMore && nextCursor ? buildUrl(nextCursor) : null;

    const links = this.buildCursorLinks(firstPageURL, previousPageURL, nextPageURL);

    return new PaginatedResponse(
      items,
      new PaginationMeta(
        null,
        null,
        null,
        lastPage,
        perPage,
        total,
        nextCursor,
        previousCursor
      ),
      path,
      firstPageURL,
      previousPageURL,
      nextPageURL,
      null,
      links
    );
  }

  protected buildOffsetLinks(currentPage: number, lastPage: number, buildUrl: (page: number) => string) {
    const links = new Array<PaginationLink>();

    links.push(new PaginationLink(
      currentPage > 1 ? buildUrl(currentPage - 1) : null,
      '&laquo; Previous',
      PaginationLinkTypeEnum.PREVIOUS,
      false
    ));

    for (let i = 1; i <= lastPage; i++) {
      links.push(new PaginationLink(
        buildUrl(i),
        String(i),
        PaginationLinkTypeEnum.PAGE,
        i === currentPage
      ));
    }

    links.push(new PaginationLink(
      currentPage < lastPage ? buildUrl(currentPage + 1) : null,
      'Next &raquo;',
      PaginationLinkTypeEnum.NEXT,
      false
    ));

    return links;
  }

  protected buildCursorLinks(firstPageURL: string, previousPageURL: string | null, nextPageURL: string | null) {
    const links = new Array<PaginationLink>();

    links.push(new PaginationLink(
      firstPageURL,
      'First',
      PaginationLinkTypeEnum.FIRST,
      false
    ));

    links.push(new PaginationLink(
      previousPageURL,
      '&laquo; Previous',
      PaginationLinkTypeEnum.PREVIOUS,
      false
    ));

    links.push(new PaginationLink(
      nextPageURL,
      'Next &raquo;',
      PaginationLinkTypeEnum.NEXT,
      false
    ));

    return links;
  }
}
