import { Page } from '@x-spacy/pagination/schemas/Page';

export function paginate<T>(items: Array<T>, total: number, hasMore: boolean | null = null) {
  return new Page(items, total, hasMore);
}
