import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { OrderPositionData } from '../../../../../_model/_output/order-position-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SuppliersService } from '../../../../../_services/suppliers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public orderPositionData: OrderPositionData;
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
      this.orderPositionData.supplierId, this.orderPositionData.formatData.id, name);
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(
      this.orderPositionData.supplierId, this.orderPositionData.formatData.id, name);
  }

  public onVacancyNameChanging($event: KeyboardEvent): void {
    // const maxLength = this.getMaxLength('vacancy-name');
    // if (maxLength <= this.advertisement.string.vacancyName.length) {
    //   $event.preventDefault();
    // }
  }

  public onVacancyNameChange() {
    this.orderPositionData.stringData.vacancyName = this.normalizeString(
      this.orderPositionData.stringData.vacancyName);
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
    this.orderPositionData.stringData.vacancyAdditional = this.normalizeString(
      this.orderPositionData.stringData.vacancyAdditional);
  }

  public onCompanyNameChange() {
    this.orderPositionData.stringData.anonymousCompanyName = this.normalizeString(
      this.orderPositionData.stringData.anonymousCompanyName);
  }

  private normalizeString(input: string): string {
    const output = input.replace(/(\r\n|\n|\r)/gm, '');
    return output;
  }
}
