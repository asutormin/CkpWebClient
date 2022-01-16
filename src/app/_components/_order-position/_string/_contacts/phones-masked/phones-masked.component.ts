import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormatData } from 'src/app/_model/_output/format-data';
import { PhoneData } from 'src/app/_model/_output/_string/phone-data';
import { StringConfigService } from 'src/app/_services/string-config.service';
import { PhoneMaskedComponent } from '../phone-masked/phone-masked.component';

@Component({
  selector: 'app-phones-masked',
  templateUrl: './phones-masked.component.html',
  styleUrls: ['./phones-masked.component.scss']
})
export class PhonesMaskedComponent implements OnInit, AfterViewInit {
  @ViewChild('phone0') phone0Component: PhoneMaskedComponent;
  @ViewChild('phone1') phone1Component: PhoneMaskedComponent;
  @ViewChild('phone2') phone2Component: PhoneMaskedComponent;
  @ViewChild('phone3') phone3Component: PhoneMaskedComponent;

  @Input() public phonesData: PhoneData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public lengthError = false;
  public requiredError = false;
  public numberError = false;
  public submitted = false;

  public get Valid(): boolean {
    this.checkErrors();

    return this.submitted && !this.requiredError && !this.lengthError && !this.numberError;
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
    this.phone2Component.setPhoneData(this.phonesData[2]);
    this.phone3Component.setPhoneData(this.phonesData[3]);
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getTotalLength(): number {
    const isPhone0Set = this.phone0Component && this.phone0Component.getLength() > 0;
    const isPhone1Set = this.phone1Component && this.phone1Component.getLength() > 0;
    const isPhone2Set = this.phone2Component && this.phone2Component.getLength() > 0;
    const isPhone3Set = this.phone3Component && this.phone3Component.getLength() > 0;

    let totalLength = (isPhone0Set ? this.phone0Component.getLength() : 0) +
      (isPhone1Set ? this.phone1Component.getLength() : 0) +
      (isPhone2Set ? this.phone2Component.getLength() : 0) +
      (isPhone3Set ? this.phone3Component.getLength() : 0);

    // Разделитель между телефонами ', ' - 2 символа
    if (!isPhone0Set && !isPhone1Set && !isPhone2Set && !isPhone3Set) {
      // 0000
      totalLength += 0;
    } else if (!isPhone0Set && !isPhone1Set && !isPhone2Set && isPhone3Set) {
      // 0001
      totalLength += 0
    } else if (!isPhone0Set && !isPhone1Set && isPhone2Set && !isPhone3Set) {
      // 0010
      totalLength += 0;
    } else if (!isPhone0Set && !isPhone1Set && isPhone2Set && isPhone3Set) {
      // 0011
      totalLength += 2;
    } else if (!isPhone0Set && isPhone1Set && !isPhone2Set && !isPhone3Set) {
      // 0100
      totalLength += 0;
    } else if (!isPhone0Set && isPhone1Set && !isPhone2Set && isPhone3Set) {
      // 0101
      totalLength += 2;
    } else if (!isPhone0Set && isPhone1Set && isPhone2Set && !isPhone3Set) {
      // 0110
      totalLength += 2;
    } else if (!isPhone0Set && isPhone1Set && isPhone2Set && isPhone3Set) {
      // 0111
      totalLength += 4;
    } else if (isPhone0Set && !isPhone1Set && !isPhone2Set && !isPhone3Set) {
      // 1000
      totalLength += 0;
    } else if (isPhone0Set && !isPhone1Set && !isPhone2Set && isPhone3Set) {
      // 1001
      totalLength += 2;
    } else if (isPhone0Set && !isPhone1Set && isPhone2Set && !isPhone3Set) {
      // 1010
      totalLength += 2
    } else if (isPhone0Set && !isPhone1Set && isPhone2Set && isPhone3Set) {
      // 1011
      totalLength += 4;
    } else if (isPhone0Set && isPhone1Set && !isPhone2Set && !isPhone3Set) {
      // 1100
      totalLength += 2;
    } else if (isPhone0Set && isPhone1Set && !isPhone2Set && isPhone3Set) {
      // 1101
      totalLength += 4;
    } else if (isPhone0Set && isPhone1Set && isPhone2Set && !isPhone3Set) {
      // 1110
      totalLength += 4;
    } else {
      // 1111
      totalLength += 6;
    }

    /*
          // Разделитель между телефонами ', ' - 2 символа
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
    */
    return totalLength;
  }

  public onPhoneChanged() {
    this.phonesData.length = 0;

    let orderBy = 0;

    const phoneData0 = this.phone0Component.getPhoneData();
    if (phoneData0) {
      phoneData0.orderBy = orderBy;
      this.phonesData.push(phoneData0);
      orderBy++;
    }
    const phoneData1 = this.phone1Component.getPhoneData();
    if (phoneData1) {
      phoneData1.orderBy = orderBy;
      this.phonesData.push(phoneData1);
      orderBy++;
    }
    const phoneData2 = this.phone2Component.getPhoneData();
    if (phoneData2) {
      phoneData2.orderBy = orderBy;
      this.phonesData.push(phoneData2);
      orderBy++;
    }
    const phoneData3 = this.phone3Component.getPhoneData();
    if (phoneData3) {
      phoneData3.orderBy = orderBy;
      this.phonesData.push(phoneData3);
    }

    this.checkErrors();
  }

  private checkErrors(): void {
    const maxLength = this.getMaxLength('phones');
    const totalLength = this.getTotalLength();

    this.lengthError = maxLength < totalLength ? true : false;
    this.requiredError = (this.phonesData && this.phonesData.length > 0) ? false : true;
    this.numberError = this.phonesData.findIndex(
      pd =>
        !pd.countryCode || (pd.countryCode && pd.countryCode === '') ||
        !pd.code || (pd.code && pd.code === '') ||
        !pd.number || (pd.number && pd.number === '')) > -1;
  }

}
