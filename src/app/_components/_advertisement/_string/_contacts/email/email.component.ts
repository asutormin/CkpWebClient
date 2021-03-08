import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AdvEmail} from '../../../../../_model/advertisement/string/adv-email';
import {AdvAddress} from '../../../../../_model/advertisement/string/adv-address';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  @ViewChild('f', { static: false }) private form: NgForm;

  @Input() public advEmails: AdvEmail[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public emailToDisplay: string;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (this.advEmails !== undefined) {
      if (this.advEmails.length > 0) {
        this.emailToDisplay = this.advEmails.sort((a, b) => (a.orderBy < b.orderBy ? -1 : 1))[0].value;
      } else {
        this.emailToDisplay = '';
      }
    }
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public onEmailChanging($event: KeyboardEvent): void {
    const maxLength = this.getMaxLength('email');
    if (maxLength <= this.emailToDisplay.length) {
      $event.preventDefault();
    }
  }

  public onEmailChanged(): void {
    this.advEmails.length = 0;

    if (this.emailToDisplay.isEmpty()) {
      return;
    }

    const email = new AdvEmail();
    email.value = this.emailToDisplay;
    email.orderBy = 0;
    this.advEmails.push(email);
  }
}
