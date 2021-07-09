import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AdvAddress} from '../../../../../_model/advertisement/string/adv-address';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public advAddresses: AdvAddress[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public addressToDisplay: string;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (this.advAddresses !== undefined) {
      if (this.advAddresses.length > 0) {
        this.addressToDisplay = this.advAddresses.sort((a, b) => (a.orderBy < b.orderBy ? -1 : 1))[0].value;
      } else {
        this.addressToDisplay = '';
      }
    }
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public onAddressChanging($event: KeyboardEvent): void {
    const maxLength = this.getMaxLength('address');
    if (maxLength <= this.addressToDisplay.length) {
      $event.preventDefault();
    }
  }

  public onAddressChanged(): void {
    this.advAddresses.length = 0;

    if (this.addressToDisplay.isEmpty()) {
      return;
    }

    const address = new AdvAddress();
    address.value = this.addressToDisplay;
    this.advAddresses.push(address);
  }
}
