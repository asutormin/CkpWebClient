import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AdvPhone} from '../../../../../_model/advertisement/string/adv-phone';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {PhoneComponent} from '../phone/phone.component';
import {isNumber} from 'util';

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html',
  styleUrls: ['./phones.component.scss']
})
export class PhonesComponent implements OnInit, AfterViewInit {

  @ViewChild('phone0') phone0Component: PhoneComponent;
  @ViewChild('phone1') phone1Component: PhoneComponent;
  @ViewChild('phone2') phone2Component: PhoneComponent;

  @Input() public advPhones: AdvPhone[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public lengthError = false;
  public requiredError = false;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && !this.requiredError && !this.lengthError;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

    this.requiredError = this.advPhones.length > 0 ? false : true;

    this.phone0Component.setAdvPhone(this.advPhones[0]);
    this.phone1Component.setAdvPhone(this.advPhones[1]);
    this.phone2Component.setAdvPhone(this.advPhones[3]);
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public getTotalLength(): number {
    const totalLength = (this.phone0Component === undefined ? 0 : this.phone0Component.getLength()) +
      (this.phone1Component === undefined ? 0 : this.phone1Component.getLength()) +
      (this.phone2Component === undefined ? 0 : this.phone2Component.getLength());
    return totalLength;
  }

  // public getTotalLength(): number {
  //   let length = 0;
  //
  //   this.advPhones.forEach(p => {
  //
  //     if (p.countryCode) {
  //       length += p.countryCode.length;
  //     }
  //     if (p.code.length) {
  //       length += p.code.length;
  //     }
  //     if (p.number) {
  //       length += p.number.length;
  //     }
  //     if (p.description) {
  //       length += p.description.length;
  //     }
  //
  //   });
  //
  //   return length;
  // }

  public onPhoneChanged() {
    this.advPhones.length = 0;

    let orderBy = 0;

    const advPhone0 = this.phone0Component.getAdvPhone();
    if (advPhone0 !== undefined) {
      advPhone0.orderBy = orderBy;
      this.advPhones.push(advPhone0);
      orderBy++;
    }
    const advPhone1 = this.phone1Component.getAdvPhone();
    if (advPhone1 !== undefined) {
      advPhone1.orderBy = orderBy;
      this.advPhones.push(advPhone1);
      orderBy++;
    }
    const advPhone2 = this.phone2Component.getAdvPhone();
    if (advPhone2 !== undefined) {
      advPhone2.orderBy = orderBy;
      this.advPhones.push(advPhone2);
    }

    const maxLength = this.getMaxLength('phones');
    const totalLength = this.getTotalLength();
    this.lengthError = maxLength < totalLength ? true : false;

    this.requiredError = this.advPhones.length > 0 ? false : true;
  }

}
