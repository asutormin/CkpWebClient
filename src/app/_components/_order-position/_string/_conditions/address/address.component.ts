import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AddressData } from '../../../../../_model/_output/_string/address-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public addressesData: AddressData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public addressToDisplay: string;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (this.addressesData !== undefined) {
      if (this.addressesData.length > 0) {
        this.addressToDisplay = this.addressesData.sort((a, b) => (a.orderBy < b.orderBy ? -1 : 1))[0].value;
      } else {
        this.addressToDisplay = '';
      }
    }
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public onAddressChanging($event: KeyboardEvent): void {
    const maxLength = this.getMaxLength('address');
    if (maxLength <= this.addressToDisplay.length) {
      $event.preventDefault();
    }
  }

  public onAddressChanged(): void {
    this.addressesData.length = 0;

    if (this.addressToDisplay.isEmpty()) {
      return;
    }

    const address = new AddressData();
    address.value = this.addressToDisplay;
    this.addressesData.push(address);
  }
}
