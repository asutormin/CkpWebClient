import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EmailData } from '../../../../../_model/_output/_string/email-data';
import { AddressData } from '../../../../../_model/_output/_string/address-data';
import { FormatData } from '../../../../../_model/_output/format-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public emailsData: EmailData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public emailToDisplay: string;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (this.emailsData !== undefined) {
      if (this.emailsData.length > 0) {
        this.emailToDisplay = this.emailsData.sort((a, b) => (a.orderBy < b.orderBy ? -1 : 1))[0].value;
      } else {
        this.emailToDisplay = '';
      }
    }
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public onEmailChanging($event: KeyboardEvent): void {
    const maxLength = this.getMaxLength('email');
    if (maxLength <= this.emailToDisplay.length) {
      $event.preventDefault();
    }
  }

  public onEmailChanged(): void {
    this.emailsData.length = 0;

    if (this.emailToDisplay.isEmpty()) {
      return;
    }

    const email = new EmailData();
    email.value = this.emailToDisplay;
    email.orderBy = 0;
    this.emailsData.push(email);
  }
}
