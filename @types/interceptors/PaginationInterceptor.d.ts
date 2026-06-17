import {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { Page } from '../schemas/Page';
import { PaginatedResponse } from '../schemas/PaginatedResponse';
import { PaginationOptions } from '../schemas/PaginationOptions';

export declare class PaginateInterceptor<T> implements NestInterceptor<Page<T>, PaginatedResponse<T>> {
  constructor(options?: PaginationOptions);

  intercept(context: ExecutionContext, next: CallHandler<Page<T>>): Observable<PaginatedResponse<T>>;
}
