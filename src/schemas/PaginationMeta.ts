import { Expose } from 'class-transformer';

export class PaginationMeta {
  @Expose({ name: 'from' })
  public readonly from: number | null;

  @Expose({ name: 'to' })
  public readonly to: number | null;

  @Expose({ name: 'current_page' })
  public readonly currentPage: number | null;

  @Expose({ name: 'last_page' })
  public readonly lastPage: number;

  @Expose({ name: 'per_page' })
  public readonly perPage: number;

  @Expose({ name: 'total' })
  public readonly total: number;

  @Expose({ name: 'next_cursor' })
  public readonly nextCursor: string | null;

  @Expose({ name: 'previous_cursor' })
  public readonly previousCursor: string | null;

  constructor(
    from: number | null,
    to: number | null,
    currentPage: number | null,
    lastPage: number,
    perPage: number,
    total: number,
    nextCursor: string | null = null,
    previousCursor: string | null = null
  ) {
    this.from = from;
    this.to = to;
    this.currentPage = currentPage;
    this.lastPage = lastPage;
    this.perPage = perPage;
    this.total = total;
    this.nextCursor = nextCursor;
    this.previousCursor = previousCursor;
  }
}
