import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {FormatData} from '../../../../../_model/_output/format-data';
import {ContactData} from '../../../../../_model/_output/_string/contact-data';
import {PhoneData} from '../../../../../_model/_output/_string/phone-data';
import {EmailData} from '../../../../../_model/_output/_string/email-data';
import {PersonComponent} from '../person/person.component';
import {EmailComponent} from '../email/email.component';
import { PhonesMaskedComponent } from '../phones-masked/phones-masked.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  @ViewChild('person') private personComponent: PersonComponent;
  @ViewChild('phones') private phonesComponent: PhonesMaskedComponent;
  @ViewChild('email') private emailComponent: EmailComponent;

  private submitted = false;

  @Input() public contactData: ContactData;
  @Input() public phonesData: PhoneData[];
  @Input() public emailsData: EmailData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public set Submitted(value: boolean) {

    this.submitted = value;

    if (this.personComponent) {
      this.personComponent.submitted = value;
    }

    if (this.phonesComponent) {
      this.phonesComponent.submitted = value;
    }

    if (this.emailComponent) {
      this.emailComponent.submitted = value;
    }
  }

  public get Valid(): boolean {
    return this.submitted &&
      (this.personComponent  ? this.personComponent.Valid : true) &&
      (this.phonesComponent ? this.phonesComponent.Valid : true) &&
      (this.emailComponent ? this.emailComponent.Valid : true);
  }

  constructor(
    private stringConfigService: StringConfigService
  ) {}

  public ngOnInit(): void {
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(this.supplierId, this.formatData.id, name);
  }
}
