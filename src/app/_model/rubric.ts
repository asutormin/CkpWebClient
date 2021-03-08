import {BaseEntity} from './base-entity';

export class Rubric extends BaseEntity {
  number: string;
  version: Date;
  canUse: boolean;
}
