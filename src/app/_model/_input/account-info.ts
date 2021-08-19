import { LegalPersonInfo } from './legal-person-info';
import { BankInfo } from './bank-info';
import { OrderPositionInfo } from './order-position-info';

export class AccountInfoLight {
  id: number;
  number: string;
  date: Date;
  sum: number;
  paid: number;
  nds: number;
  supplier: LegalPersonInfo;

  constructor() {
    this.supplier = new LegalPersonInfo();
  }
}

export class AccountInfo extends AccountInfoLight {
  client: LegalPersonInfo;
  bank: BankInfo;
  positions: OrderPositionInfo[];

  constructor() {
    super();
    this.client = new LegalPersonInfo();
    this.bank = new BankInfo();
    this.positions = [];
  }
}
