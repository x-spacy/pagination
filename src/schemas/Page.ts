export class Page<T> {
  public readonly items: Array<T>;

  public readonly total: number;

  public constructor(items: Array<T>, total: number) {
    this.items = items;
    this.total = total;
  }
}
