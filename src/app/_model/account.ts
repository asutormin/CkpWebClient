import {LegalPerson} from './legal-person';
import {Bank} from './bank';

export class AccountLight {
  id: number;
  number: string;
  date: Date;
  sum: number;
  paid: number;
  nds: number;
  supplier: LegalPerson;

  constructor() {
    this.supplier = new LegalPerson();
  }
}

export class Account extends AccountLight {
  client: LegalPerson;
  bank: Bank;
  positions: Position[];

  constructor() {
    super();
    this.client = new LegalPerson();
    this.bank = new Bank();
    this.positions = [];
  }
}
