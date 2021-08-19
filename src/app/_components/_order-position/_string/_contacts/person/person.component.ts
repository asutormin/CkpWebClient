import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContactData } from '../../../../../_model/_output/_string/contact-data';
import { FormatData } from '../../../../../_model/_output/format-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @ViewChild('f') private form: NgForm;
  private contactData: ContactData;

  public submitted = false;

  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  @Input() public set ContactData(contactData: ContactData) {
    this.contactData = contactData;
  }

  public get ContactData() {
    return this.contactData === undefined ? new ContactData() : this.contactData;
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
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getTotalLength(): number {
    return (this.ContactData.firstName ? this.ContactData.firstName.length : 0) +
      (this.ContactData.secondName ? this.ContactData.secondName.length : 0) +
      (this.ContactData.lastName ? this.ContactData.lastName.length : 0);
  }

}
