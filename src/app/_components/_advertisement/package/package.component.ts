import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Advertisement } from '../../../_model/advertisement/advertisement';
import {TariffComponent} from '../tariff/tariff.component';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

  @ViewChildren(TariffComponent) tariffComponents: QueryList<TariffComponent>;

  private advertisement: Advertisement;
  private submitted = false;

  @Input() public set Advertisement(advertisement: Advertisement) {
    this.advertisement = advertisement;
  }

  public get Advertisement() {
    return this.advertisement === undefined ? new Advertisement() : this.advertisement;
  }

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.tariffComponents !== undefined) {
      this.tariffComponents.toArray().forEach(t => {
        if (t !== undefined) {
          t.Submitted = value;
        } });
    }
  }

  public get Valid(): boolean {
    return this.submitted && this.tariffComponents.toArray().every(t => t.Valid);
  }

  constructor() {  }

  ngOnInit() {
  }
}
