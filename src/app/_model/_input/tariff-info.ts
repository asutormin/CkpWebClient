import { FormatInfo } from './format-info';
import { SupplierInfo } from './supplier-info';
import { PriceInfo } from './price-info';

export class TariffInfo {
  supplier: SupplierInfo;
  format: FormatInfo;
  price: PriceInfo;
  packageTariffs: TariffInfo[];

  constructor() {
    this.supplier = new SupplierInfo();
    this.format = new FormatInfo();
    this.price = new PriceInfo();
    this.packageTariffs = [];
  }
}
