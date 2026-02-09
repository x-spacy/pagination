import {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { Page } from '../schemas/Page';
import { PaginatedResponse } from '../schemas/PaginatedResponse';

export declare class PaginateInterceptor<T> implements NestInterceptor<Page<T>, PaginatedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<Page<T>>): Observable<PaginatedResponse<T>>;
}
