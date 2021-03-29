import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdvPhone} from '../../../../../_model/advertisement/string/adv-phone';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {

  private advPhone: AdvPhone;
  private canExtractPhone: boolean;

  @Output() public phoneChanged = new EventEmitter();

  public advPhoneToDisplay: any;

  constructor() {
    this.advPhoneToDisplay = { number: '', description: '' };
  }

  public ngOnInit(): void {
  }

  public setAdvPhone(advPhone: AdvPhone): void {
    function format(value, pattern) {
      let i = 0;
      const v = value.toString();
      return pattern.replace(/#/g, _ => v[i++]);
    }

    this.advPhone = advPhone;
    if (advPhone !== undefined) {
      let advNumberToDisplay = advPhone.countryCode.concat(advPhone.code).concat(advPhone.number);
      advNumberToDisplay = advNumberToDisplay;
      advNumberToDisplay = format(advNumberToDisplay, '## (###) ### ## ##');
      const advDescriptionToDisplay = advPhone.description === null ? '' : advPhone.description;
      this.advPhoneToDisplay = { number: advNumberToDisplay, description: advDescriptionToDisplay };
    }
  }

  public getAdvPhone(): AdvPhone {
    return this.advPhone;
  }

  public getLength(): number {
    const length = this.extractCountryCode().length +
      this.extractCode().length +
      this.extractNumber().length +
      this.advPhoneToDisplay.description.length;
    return length;
  }

  public onFilledPhoneNumber($event: boolean): void {
    this.canExtractPhone = $event;
  }

  public onExtractPhone($event: string): void {
    this.refillAdvPhone();
    console.log(this.advPhone);
  }

  public onPhoneDescriptionChanged($event: any): void {
    this.advPhoneToDisplay.description = $event;
    this.refillAdvPhone();
  }

  private refillAdvPhone(): void {
    function format(value, pattern) {
      let i  = 0;
      const v = value.toString();
      return pattern.replace(/#/g, _ => v[i++]);
    }

    if (this.advPhone === undefined) {
      this.advPhone = new AdvPhone();
    }
    if (this.canExtractPhone) {
      this.advPhoneToDisplay.number = format(
        this.advPhoneToDisplay.number.replace(/\D/g, ''), '+# (###) ### ## ##')
      this.advPhone.countryCode = this.extractCountryCode();
      this.advPhone.code = this.extractCode();
      this.advPhone.number = this.extractNumber();
    } else {
      this.advPhone.countryCode = undefined;
      this.advPhone.code = undefined;
      this.advPhone.number = undefined;
    }
    if (this.advPhoneToDisplay.description.isEmpty()) {
      this.advPhone.description = undefined;
    } else {
      this.advPhone.description = this.advPhoneToDisplay.description;
    }
    if ((this.advPhone.countryCode === undefined || this.advPhone.code === undefined || this.advPhone.number === undefined) &&
      (this.advPhone.description === undefined)) {
      this.advPhone = undefined;
    }
    this.phoneChanged.emit();
  }

  private extractCountryCode(): string {
    return this.advPhoneToDisplay.number.substring(0, 2);
  }

  private extractCode(): string {
    return this.advPhoneToDisplay.number.substring(4, 7);
  }

  private extractNumber(): string {
    return this.advPhoneToDisplay.number.substring(8, 18).replace(/\s/g, '');
  }

  public onPhoneChanged($event: any): void {
    console.log('onPhoneChanged ', $event);
    this.advPhoneToDisplay.number = $event;
  }
}
