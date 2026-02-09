import { PaginationLink } from './PaginationLink';
import { PaginationMeta } from './PaginationMeta';

export declare class PaginatedResponse<T> {
  public readonly items: Array<T>;

  public readonly meta: PaginationMeta;

  public readonly path: string;

  public readonly firstPageURL: string;

  public readonly previousPageURL: string | null;

  public readonly nextPageURL: string | null;

  public readonly lastPageURL: string;

  public readonly links: Array<PaginationLink>;
}
