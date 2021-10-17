import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhoneData } from 'src/app/_model/_output/_string/phone-data';

@Component({
  selector: 'app-phone-masked',
  templateUrl: './phone-masked.component.html',
  styleUrls: ['./phone-masked.component.scss']
})
export class PhoneMaskedComponent implements OnInit {
  @Input() public elementIndex: number = 0;
  @Output() public phoneChanged = new EventEmitter();
  
  public phoneNumber: string = '';
  public phoneDescription: string = '';
  public mouseOverCountryCode: boolean;
  public phoneData: PhoneData;

  constructor() { }

  public ngOnInit(): void {
  }

  public getPhoneData(): PhoneData {
    return this.phoneData;
  }

  public setPhoneData(phoneData: PhoneData): void {
    if (phoneData) {
      this.phoneData = phoneData;

      this.setCountryCode(phoneData.countryCode);
  
      const phoneNumber = phoneData.code.concat(phoneData.number);
      this.onFormatPhone(phoneNumber);

      this.phoneDescription = phoneData.description;
     }
  }

  public getLength(): number {
    let length = this.phoneNumber.replace(/ /g, '').length;

    // Учитываем скобки
    if (length > 0)
      length += this.getCountryCode().length 
    
    // Если задано описание - учитываем пробел между телефоном и описанием
    if (this.phoneDescription && this.phoneDescription.length > 0)
      length += this.phoneDescription.length + 1;

    return length;
  }

  public isPhoneReady(): boolean {
    const regex: RegExp = new RegExp(/\((\d{3})\) (\d{3}) (\d{2}) (\d{2})/);
    const match = this.phoneNumber.match(regex);

    return match ? true : false;
  }

  public isCountryCodeEnabled(): boolean {
    return this.phoneNumber.length > 0 ||
      this.mouseOverCountryCode ||
      (document.getElementById(`selectCountryCode-${this.elementIndex}`) as HTMLSelectElement).selectedIndex > 0;
  }

  public onCountryCodeChanged($event: any): void {
    const countryCode = $event.target.value.trim();
    if (this.phoneData)
      this.phoneData.countryCode = countryCode;
  }

  public onPhoneChanged($event: string): void {
    this.onFormatPhone($event);

    if (this.isPhoneReady())
      this.createPhoneData();
    else
      this.resetPhoneData();

      this.phoneChanged.emit();
  }

  public onPhoneDescriptionChanged($event: string): void {
    this.phoneDescription = $event;

    if (this.phoneData)
      this.phoneData.description = $event;

    this.phoneChanged.emit();
  }

  private onFormatPhone($event: string): void {
    let phone = $event.toString().trim().replace(/[^0-9]/g, '');

    let result: string = '';
    const code = phone.slice(0, 3);
    const number = phone.slice(3);
    const numberPart1 = number.slice(0, 3);
    const numberPart2 = number.slice(3, 5);
    const numberPart3 = number.slice(5);

    if (code)
      if (code.length == 3) {
        result += `(${code}) `;
        if (number) {
          if (numberPart1.length == 3) {
            result += `${numberPart1} `;
            if (numberPart2.length == 2) {
              result += `${numberPart2} `;
              result += `${numberPart3}`;
            }
            else
              result += `${numberPart2}`;
          } else
            result += `${numberPart1}`;
        }

      } else
        result += `(${code}`;

    this.phoneNumber = result;
  }

  private createPhoneData(): void {
    this.phoneData = new PhoneData();
    this.phoneData.countryCode = this.getCountryCode();

    const regex: RegExp = new RegExp(/\((\d{3})\) (\d{3}) (\d{2}) (\d{2})/);
    const match = this.phoneNumber.match(regex);

    this.phoneData.code = match[1];
    this.phoneData.number = match[2] + match[3] + match[4];
  }

  private resetPhoneData(): void {
    this.phoneData = null;
  }

  private getCountryCode(): string {
    return (document.getElementById(`selectCountryCode-${this.elementIndex}`) as HTMLSelectElement).value;
  }

  private setCountryCode(value: string): void {
    const element = (document.getElementById(`selectCountryCode-${this.elementIndex}`) as HTMLSelectElement);
    element.value = value;
  }
}
