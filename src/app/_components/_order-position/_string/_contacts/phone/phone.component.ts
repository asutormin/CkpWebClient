import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhoneData } from '../../../../../_model/_output/_string/phone-data';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {

  private phoneData: PhoneData;
  private canExtractPhone: boolean;

  @Output() public phoneChanged = new EventEmitter();

  public phoneDataToDisplay: any;

  constructor() {
    this.phoneDataToDisplay = { number: '', description: '' };
  }

  public ngOnInit(): void {
  }

  public setPhoneData(phoneData: PhoneData): void {
    function format(value, pattern) {
      let i = 0;
      const v = value.toString();
      return pattern.replace(/#/g, _ => v[i++]);
    }

    this.phoneData = phoneData;
    if (phoneData !== undefined) {
      let phoneNumberToDisplay = phoneData.countryCode.concat(phoneData.code).concat(phoneData.number);
      phoneNumberToDisplay = phoneNumberToDisplay;
      phoneNumberToDisplay = format(phoneNumberToDisplay, '## (###) ### ## ##');
      const advDescriptionToDisplay = phoneData.description === null ? '' : phoneData.description;
      this.phoneDataToDisplay = { number: phoneNumberToDisplay, description: advDescriptionToDisplay };
    }
  }

  public getPhoneData(): PhoneData {
    return this.phoneData;
  }

  public getLength(): number {
    let length = this.extractCountryCode().length +
      this.extractCode().length +
      this.extractNumber().length +
      this.phoneDataToDisplay.description.length;
    
    // Учитываем скобки
    if (length > 0)
      length += 2;

    // Если задано описание - учитываем пробел между телефоном и описанием
    if (this.phoneDataToDisplay.description.length > 0)
      length += 1;
    
      return length;
  }

  public onFilledPhoneNumber($event: boolean): void {
    this.canExtractPhone = $event;
  }

  public onExtractPhone($event: string): void {
    this.refillPhoneData();
    console.log(this.phoneData);
  }

  public onPhoneDescriptionChanged($event: any): void {
    this.phoneDataToDisplay.description = $event;
    this.refillPhoneData();
  }

  private refillPhoneData(): void {
    function format(value, pattern) {
      let i = 0;
      const v = value.toString();
      return pattern.replace(/#/g, _ => v[i++]);
    }

    if (this.phoneData === undefined) {
      this.phoneData = new PhoneData();
    }
    if (this.canExtractPhone) {
      this.phoneDataToDisplay.number = format(
        this.phoneDataToDisplay.number.replace(/\D/g, ''), '+# (###) ### ## ##')
      this.phoneData.countryCode = this.extractCountryCode();
      this.phoneData.code = this.extractCode();
      this.phoneData.number = this.extractNumber();
    } else {
      this.phoneData.countryCode = undefined;
      this.phoneData.code = undefined;
      this.phoneData.number = undefined;
    }
    if (this.phoneDataToDisplay.description.isEmpty()) {
      this.phoneData.description = undefined;
    } else {
      this.phoneData.description = this.phoneDataToDisplay.description;
    }
    if ((this.phoneData.countryCode === undefined || this.phoneData.code === undefined || this.phoneData.number === undefined) &&
      (this.phoneData.description === undefined)) {
      this.phoneData = undefined;
    }
    this.phoneChanged.emit();
  }

  private extractCountryCode(): string {
    return this.phoneDataToDisplay.number.substring(0, 2);
  }

  private extractCode(): string {
    return this.phoneDataToDisplay.number.substring(4, 7);
  }

  private extractNumber(): string {
    return this.phoneDataToDisplay.number.substring(8, 18).replace(/\s/g, '');
  }

  public onPhoneChanged($event: any): void {
    this.phoneDataToDisplay.number = $event;
  }

}
