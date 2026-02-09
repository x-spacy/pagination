import { Expose } from 'class-transformer';

import { PaginationLinkTypeEnum } from '@x-spacy/pagination/enums/PaginationLinkTypeEnum';

export class PaginationLink {
  @Expose({ name: 'url' })
  public readonly url: string | null;

  @Expose({ name: 'label' })
  public readonly label: string;

  @Expose({ name: 'type' })
  public readonly type: PaginationLinkTypeEnum;

  @Expose({ name: 'active' })
  public readonly active: boolean;

  constructor(
    url: string | null,
    label: string,
    type: PaginationLinkTypeEnum,
    active: boolean
  ) {
    this.url = url;
    this.label = label;
    this.type = type;
    this.active = active;
  }
}
