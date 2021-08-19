import {BaseEntity} from './base-entity';

export class LegalPersonInfoLight extends BaseEntity {
}

export class LegalPersonInfo extends LegalPersonInfoLight {
  inn: string;
  kpp: string;
  okpo: string;
  legalAddress: string;
}
