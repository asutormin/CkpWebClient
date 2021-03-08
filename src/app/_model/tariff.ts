import {Format} from './format';
import {Company} from './company';
import {Price} from './price';

export class Tariff {
  supplier: Company;
  format: Format;
  price: Price;
  packageTariffs: Tariff[];

  constructor() {
    this.supplier = new Company();
    this.format = new Format();
    this.price = new Price();
    this.packageTariffs = [];
  }
}
