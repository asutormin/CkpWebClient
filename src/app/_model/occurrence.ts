import {BaseEntity} from './base-entity';

export class Occurrence extends BaseEntity {
  typeId: number;

  constructor() {
    super();
    this.typeId = 0;
  }
}
