import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { TariffComponent } from '../tariff/tariff.component';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

  @ViewChildren(TariffComponent) tariffComponents: QueryList<TariffComponent>;

  private orderPositionData: OrderPositionData;
  private submitted = false;

  @Input() public set OrderPositionData(advertisement: OrderPositionData) {
    this.orderPositionData = advertisement;
  }

  public get OrderPositionData() {
    return this.orderPositionData === undefined ? new OrderPositionData() : this.orderPositionData;
  }

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.tariffComponents !== undefined) {
      this.tariffComponents.toArray().forEach(t => {
        if (t !== undefined) {
          t.Submitted = value;
        }
      });
    }
  }

  public get Valid(): boolean {
    return this.submitted && this.tariffComponents.toArray().every(t => t.Valid);
  }

  constructor() { }

  ngOnInit() {
  }
}
