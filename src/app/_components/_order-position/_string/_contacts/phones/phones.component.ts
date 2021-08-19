import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PhoneData} from '../../../../../_model/_output/_string/phone-data';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {FormatData} from '../../../../../_model/_output/format-data';
import {PhoneComponent} from '../phone/phone.component';

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html',
  styleUrls: ['./phones.component.scss']
})
export class PhonesComponent implements OnInit, AfterViewInit {

  @ViewChild('phone0') phone0Component: PhoneComponent;
  @ViewChild('phone1') phone1Component: PhoneComponent;
  @ViewChild('phone2') phone2Component: PhoneComponent;

  @Input() public phonesData: PhoneData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public lengthError = false;
  public requiredError = false;
  public numberError = false;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && !this.requiredError && !this.lengthError  && !this.numberError;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.checkErrors();

    this.phone0Component.setPhoneData(this.phonesData[0]);
    this.phone1Component.setPhoneData(this.phonesData[1]);
    this.phone2Component.setPhoneData(this.phonesData[3]);
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getTotalLength(): number {
      const isPhone0Set = this.phone0Component && this.phone0Component.getLength() > 0;
      const isPhone1Set = this.phone1Component && this.phone1Component.getLength() > 0;
      const isPhone2Set = this.phone2Component && this.phone2Component.getLength() > 0;

    let totalLength = (isPhone0Set ? this.phone0Component.getLength() : 0) +
      (isPhone1Set ? this.phone1Component.getLength() : 0) +
      (isPhone2Set ? this.phone2Component.getLength() : 0);

      if (!isPhone0Set && !isPhone1Set && !isPhone2Set) {
        // 000
        totalLength += 0;
      } else if (!isPhone0Set && !isPhone1Set && isPhone2Set) {
        // 001
        totalLength += 0;
      } else if (!isPhone0Set && isPhone1Set && !isPhone2Set) {
        // 010
        totalLength += 0;
      } else if (!isPhone0Set && isPhone1Set && isPhone2Set) {
        // 011
        totalLength += 2;
      } else if (isPhone0Set && !isPhone1Set && !isPhone2Set) {
        // 100
        totalLength += 0;
      } else if (isPhone0Set && !isPhone1Set && isPhone2Set) {
        // 101
        totalLength += 2;
      } else if (isPhone0Set && isPhone1Set && !isPhone2Set) {
        // 110
        totalLength += 2;
      } else if (isPhone0Set && isPhone1Set && isPhone2Set) {
        // 111
        totalLength += 4;
      }

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
    this.phonesData.length = 0;

    let orderBy = 0;

    const phoneData0 = this.phone0Component.getPhoneData();
    if (phoneData0 !== undefined) {
      phoneData0.orderBy = orderBy;
      this.phonesData.push(phoneData0);
      orderBy++;
    }
    const phoneData1 = this.phone1Component.getPhoneData();
    if (phoneData1 !== undefined) {
      phoneData1.orderBy = orderBy;
      this.phonesData.push(phoneData1);
      orderBy++;
    }
    const phoneData2 = this.phone2Component.getPhoneData();
    if (phoneData2 !== undefined) {
      phoneData2.orderBy = orderBy;
      this.phonesData.push(phoneData2);
    }

    this.checkErrors();
  }

  private checkErrors(): void {
    const maxLength = this.getMaxLength('phones');
    const totalLength = this.getTotalLength();

    this.lengthError = maxLength < totalLength ? true : false;
    this.requiredError = this.phonesData.length > 0 ? false : true;
    this.numberError = this.phonesData.findIndex(
      pd => 
        !pd.countryCode || (pd.countryCode && pd.countryCode === '') ||
        !pd.code || (pd.code && pd.code === '') ||
        !pd.number || (pd.number && pd.number === '')) > -1;
  }

}
