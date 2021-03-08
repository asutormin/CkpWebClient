import {BaseEntity} from './base-entity';

export class LegalPersonLight extends BaseEntity {
}

export class LegalPerson extends LegalPersonLight {
  inn: string;
  kpp: string;
  okpo: string;
  legalAddress: string;
}
