import { BaseEntity } from './base-entity';
import { FormatTypeInfo } from './format-type-info';

export class FormatInfo extends BaseEntity {
  name: string;
  packageLength: number;
  firstSize: number;
  secondSize: number;
  enableSecondSize: boolean;
  unitName: string;
  description: string;
  version: Date;
  type: FormatTypeInfo;

  constructor() {
    super();
    this.type = new FormatTypeInfo();
  }
}
