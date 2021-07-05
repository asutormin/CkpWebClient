import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Advertisement} from '../../../../../_model/advertisement/advertisement';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {SuppliersService} from '../../../../../_services/suppliers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('f', {static: false}) private form: NgForm;

  @Input() public advertisement: Advertisement;
  @Input() public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private formBuilder: FormBuilder,
    private stringConfigService: StringConfigService) { }

  public ngOnInit(): void {
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(
      this.advertisement.supplierId, this.advertisement.format.id, name);
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(
      this.advertisement.supplierId, this.advertisement.format.id, name);
  }

  public onVacancyNameChanging($event: KeyboardEvent): void {
    // const maxLength = this.getMaxLength('vacancy-name');
    // if (maxLength <= this.advertisement.string.vacancyName.length) {
    //   $event.preventDefault();
    // }
  }

  public onVacancyNameChange() {
    this.advertisement.string.vacancyName = this.normalizeString(
      this.advertisement.string.vacancyName);
  }

  public onVacancyAdditionalChanging($event: KeyboardEvent): void {
    // const maxLength = this.getMaxLength('vacancy-additional');
    // if (maxLength <= this.advertisement.string.vacancyAdditional.length) {
    //   $event.preventDefault();
    // }
  }

  public onCompanyNameChanging($event: KeyboardEvent): void {
    // const maxLength = this.getMaxLength('vacancy-additional');
    // if (maxLength <= this.advertisement.string.companyName.length) {
    //   $event.preventDefault();
    // }
  }

  public onVacancyAdditionalChange() {
    this.advertisement.string.vacancyAdditional = this.normalizeString(
      this.advertisement.string.vacancyAdditional);
  }

  public onCompanyNameChange() {
    this.advertisement.string.anonymousCompanyName = this.normalizeString(
      this.advertisement.string.anonymousCompanyName);
  }

  private normalizeString(input: string): string {
    const output = input.replace(/(\r\n|\n|\r)/gm, '');
    return output;
  }
}
