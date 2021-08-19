import { BaseEntity } from './base-entity';

export class RubricInfo extends BaseEntity {
  number: string;
  version: Date;
  canUse: boolean;
}
