import { BaseEntity } from './base-entity';

export class OccurrenceInfo extends BaseEntity {
  typeId: number;

  constructor() {
    super();
    this.typeId = 0;
  }
}
