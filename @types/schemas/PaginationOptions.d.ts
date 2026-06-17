import { PaginationStrategyEnum } from '../enums/PaginationStrategyEnum';

export interface PaginationOptions {
  strategy?: PaginationStrategyEnum;

  cursorKey?: string;
}
