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
  public readonly firstPageURL: string;

  @Expose({ name: 'previous_page_url' })
  public readonly previousPageURL: string | null;

  @Expose({ name: 'next_page_url' })
  public readonly nextPageURL: string | null;

  @Expose({ name: 'last_page_url' })
  public readonly lastPageURL: string;

  @Expose({ name: 'links' })
  public readonly links: Array<PaginationLink>;

  constructor(
    items: Array<T>,
    meta: PaginationMeta,
    path: string,
    firstPageURL: string,
    previousPageURL: string | null,
    nextPageURL: string | null,
    lastPageURL: string,
    links: Array<PaginationLink>
  ) {
    this.items = items;
    this.meta = meta;
    this.path = path;
    this.firstPageURL = firstPageURL;
    this.previousPageURL = previousPageURL;
    this.nextPageURL = nextPageURL;
    this.lastPageURL = lastPageURL;
    this.links = links;
  }
}

