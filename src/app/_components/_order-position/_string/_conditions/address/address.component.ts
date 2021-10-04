import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AddressData } from '../../../../../_model/_output/_string/address-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';
import { StringService } from 'src/app/_services/string.service';
import { AddressInfo } from 'src/app/_model/_input/address-info';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewInit {
  @ViewChild('f') private form: NgForm;
  private currentAddress$: Subject<string>;

  @Input() public addressesData: AddressData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public currentAddress: string;
  public promptAddresses$: Observable<AddressInfo[]>;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService,
    private stringService: StringService
  ) {
    this.currentAddress$ = new Subject<string>();
    this.promptAddresses$ = this.currentAddress$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(address => this.stringService.getAddreses(address))
    );
  }

  public ngOnInit(): void {
    console.log(this.addressesData);
    if (this.addressesData) {
      this.currentAddress = this.addressesData.length > 0
        ? this.addressesData.sort((a, b) => (a.orderBy < b.orderBy ? -1 : 1))[0].value
        : this.currentAddress = '';
    }
  }

  public ngAfterViewInit(): void {
    this.refreshAddresses();
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public onCurrentAddressChanging($event: KeyboardEvent): void {
    const maxLength = this.getMaxLength('address');
    if (maxLength <= this.currentAddress.length) {
      $event.preventDefault();
    }
  }

  public onCurrentAddressChanged(): void {
    console.log(this.currentAddress);
    this.refreshAddresses();

    this.addressesData.length = 0;

    if (this.currentAddress.isEmpty()) {
      return;
    }

    const addressData = new AddressData();
    addressData.value = this.currentAddress;
    this.addressesData.push(addressData);
  }

  private refreshAddresses(): void {
    this.currentAddress$.next(this.currentAddress);
  }

  
}


