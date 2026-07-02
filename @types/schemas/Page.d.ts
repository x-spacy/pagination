export class Page<T> {
  public readonly items: Array<T>;

  public readonly total: number;

  public readonly hasMore: boolean | null;

  public constructor(items: Array<T>, total: number, hasMore?: boolean | null);
}
