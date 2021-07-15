import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AdvContact} from '../../../../../_model/advertisement/string/adv-contact';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @ViewChild('f') private form: NgForm;
  private advContact: AdvContact;

  public submitted = false;

  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  @Input() public set AdvContact(contact: AdvContact) {
    this.advContact = contact;
  }

  public get AdvContact() {
    return this.advContact === undefined ? new AdvContact() : this.advContact;
  }

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public getTotalLength(): number {
    return (this.AdvContact.firstName ? this.AdvContact.firstName.length : 0) +
      (this.AdvContact.secondName ? this.AdvContact.secondName.length : 0) +
      (this.AdvContact.lastName ? this.AdvContact.lastName.length : 0);
  }

}
