import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Advertisement} from '../../../../../_model/advertisement/advertisement';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {AdvContact} from '../../../../../_model/advertisement/string/adv-contact';
import {AdvPhone} from '../../../../../_model/advertisement/string/adv-phone';
import {AdvEmail} from '../../../../../_model/advertisement/string/adv-email';
import {PersonComponent} from '../person/person.component';
import {PhonesComponent} from '../phones/phones.component';
import {EmailComponent} from '../email/email.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  @ViewChild('person', { static: false}) private personComponent: PersonComponent;
  @ViewChild('phones', { static: false}) private phonesComponent: PhonesComponent;
  @ViewChild('email', { static: false}) private emailComponent: EmailComponent;

  private submitted = false;

  @Input() public advContact: AdvContact;
  @Input() public advPhones: AdvPhone[];
  @Input() public advEmails: AdvEmail[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public set Submitted(value: boolean) {

    this.submitted = value;

    if (this.personComponent !== undefined) {
      this.personComponent.submitted = value;
    }

    if (this.phonesComponent !== undefined) {
      this.phonesComponent.submitted = value;
    }

    if (this.emailComponent !== undefined) {
      this.emailComponent.submitted = value;
    }
  }

  public get Valid(): boolean {
    return this.submitted &&
      (this.personComponent === undefined ? true : this.personComponent.Valid) &&
      (this.phonesComponent === undefined ? true : this.phonesComponent.Valid) &&
      (this.emailComponent === undefined ? true : this.emailComponent.Valid);
  }

  constructor(
    private stringConfigService: StringConfigService
  ) {}

  public ngOnInit(): void {
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(this.advSupplierId, this.advFormat.id, name);
  }
}
