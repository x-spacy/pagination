import { Page } from '@x-spacy/pagination/schemas/Page';

export function paginate<T>(items: Array<T>, total: number) {
  return new Page(items, total);
}
