import { PaginationStrategyEnum } from '@x-spacy/pagination/enums/PaginationStrategyEnum';

export interface PaginationOptions {
  strategy?: PaginationStrategyEnum;

  cursorKey?: string;
}
