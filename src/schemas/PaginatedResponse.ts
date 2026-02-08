import { Expose } from 'class-transformer';

import { PaginationLink } from '@x-spacy/pagination/schemas/PaginationLink';
import { PaginationMeta } from '@x-spacy/pagination/schemas/PaginationMeta';

export class PaginatedResponse<T> {
  @Expose({ name: 'items' })
  public readonly items: Array<T>;

  @Expose({ name: 'meta' })
  public readonly meta: PaginationMeta;

  @Expose({ name: 'path' })
  public readonly path: string;

  @Expose({ name: 'first_page_url' })
  public readonly firstPageUrl: string;

  @Expose({ name: 'prev_page_url' })
  public readonly prevPageUrl: string | null;

  @Expose({ name: 'next_page_url' })
  public readonly nextPageUrl: string | null;

  @Expose({ name: 'last_page_url' })
  public readonly lastPageUrl: string;

  @Expose({ name: 'links' })
  public readonly links: Array<PaginationLink>;

  constructor(
    items: Array<T>,
    meta: PaginationMeta,
    path: string,
    firstPageUrl: string,
    prevPageUrl: string | null,
    nextPageUrl: string | null,
    lastPageUrl: string,
    links: Array<PaginationLink>
  ) {
    this.items = items;
    this.meta = meta;
    this.path = path;
    this.firstPageUrl = firstPageUrl;
    this.prevPageUrl = prevPageUrl;
    this.nextPageUrl = nextPageUrl;
    this.lastPageUrl = lastPageUrl;
    this.links = links;
  }
}

