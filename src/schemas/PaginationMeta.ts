import { Expose } from 'class-transformer';

export class PaginationMeta {
  @Expose({ name: 'from' })
  public readonly from: number;

  @Expose({ name: 'to' })
  public readonly to: number;

  @Expose({ name: 'current_page' })
  public readonly currentPage: number;

  @Expose({ name: 'last_page' })
  public readonly lastPage: number;

  @Expose({ name: 'per_page' })
  public readonly perPage: number;

  @Expose({ name: 'total' })
  public readonly total: number;

  constructor(
    from: number,
    to: number,
    currentPage: number,
    lastPage: number,
    perPage: number,
    total: number
  ) {
    this.from = from;
    this.to = to;
    this.currentPage = currentPage;
    this.lastPage = lastPage;
    this.perPage = perPage;
    this.total = total;
  }
}
