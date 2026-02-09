import { PaginationLinkType } from './PaginationLinkType';

export declare class PaginationLink {
  public readonly url: string | null;

  public readonly label: string;

  public readonly type: PaginationLinkType;

  public readonly active: boolean;
}
