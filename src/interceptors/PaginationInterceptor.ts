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

import { PaginationLinkTypeEnum } from '@x-spacy/pagination/enums/PaginationLinkTypeEnum';

@Injectable()
export class PaginateInterceptor<T> implements NestInterceptor<Page<T>, PaginatedResponse<T>> {
  public intercept(context: ExecutionContext, next: CallHandler<Page<T>>) {
    const request = context.switchToHttp().getRequest<Request>();

    const page = Math.max(1, parseInt(request.query.page as string, 10) ?? 1);

    const perPage = Math.min(100, Math.max(1, parseInt(request.query.perPage as string, 10) ?? 10));

    const path = `${request.protocol}://${request.get('host') + request.path}`;

    return next.handle().pipe(map((data) => {
      if (!(data instanceof Page)) {
        return data;
      }

      const { total, items } = data;

      const lastPage = Math.max(1, Math.ceil(total / perPage));
      const currentPage = Math.min(page, lastPage);

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, total);

      const from = total > 0 ? startIndex + 1 : 0;
      const to = endIndex;

      const buildUrl = (pageNumber: number): string => `${path}?page=${pageNumber}&perPage=${perPage}`;

      const links = this.buildLinks(currentPage, lastPage, buildUrl);

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
    }));
  }

  protected buildLinks(currentPage: number, lastPage: number, buildUrl: (page: number) => string) {
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
}
