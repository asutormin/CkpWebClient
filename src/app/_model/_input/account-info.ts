import { LegalPersonInfo } from './legal-person-info';
import { BankInfo } from './bank-info';
import { OrderPositionInfo } from './order-position-info';
import { AccountPositionInfo } from './account-position-info';

export class AccountInfoLight {
  id: number;
  number: string;
  date: Date;
  sum: number;
  paid: number;
  nds: number;
  supplier: LegalPersonInfo;
  typeId: number;

  constructor() {
    this.supplier = new LegalPersonInfo();
  }
}

export class AccountInfo extends AccountInfoLight {
  client: LegalPersonInfo;
  bank: BankInfo;
  accountPositions: AccountPositionInfo[];
  orderPositions: OrderPositionInfo[];
  
  constructor() {
    super();
    this.client = new LegalPersonInfo();
    this.bank = new BankInfo();
    this.orderPositions = [];
  }
}
