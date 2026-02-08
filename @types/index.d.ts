declare module '@x-spacy/pagination' {
  import { Page } from '@x-spacy/pagination/schemas/Page';
  import { PaginatedResponse } from '@x-spacy/pagination/schemas/Paginate';

  export enum PaginationLinkType {
    FIRST = 'FIRST',
    LAST = 'LAST',
    PREV = 'PREV',
    NEXT = 'NEXT',
    PAGE = 'PAGE'
  }

  export declare class PaginateInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<PaginatedResponse<T>>>;
  }

  export function paginate<T>(items: Array<T>, total: number): Page<T>;
}
