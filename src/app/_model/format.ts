import {BaseEntity} from './base-entity';
import {FormatType} from './format-type';

export class Format extends BaseEntity {
  name: string;
  packageLength: number;
  firstSize: number;
  secondSize: number;
  enableSecondSize: boolean;
  unitName: string;
  description: string;
  version: Date;
  type: FormatType;

  constructor() {
    super();
    this.type = new FormatType();
  }
}
