import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SalaryComponent } from '../salary/salary.component';
import { WorkGraphicComponent } from '../work-graphic/work-graphic.component';
import { OccurrenceComponent } from '../occurrence/occurrence.component';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { ConditionsData } from '../../../../../_model/_output/_string/_conditions/conditions-data';
import { FormatData } from '../../../../../_model/_output/format-data';
import { OccurrenceData } from '../../../../../_model/_output/_string/occurrence-data';
import { AddressData } from '../../../../../_model/_output/_string/address-data';
import { AddressComponent } from '../address/address.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit {

  @ViewChild('f') private form: NgForm;
  @ViewChild('salary') private workGraphicComponent: WorkGraphicComponent;
  @ViewChild('salary') private salaryComponent: SalaryComponent;
  @ViewChild('occurrence') private occurrenceComponent: OccurrenceComponent;
  @ViewChild('address') private addressComponent: AddressComponent;

  private submitted = false;

  @Input() public conditionsData: ConditionsData;
  @Input() public occurrenciesData: OccurrenceData[];
  @Input() public addressesData: AddressData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;
  @Input() public orderPositionId: number;
  @Input() public totalLength = 0;

  @Output() public changed = new EventEmitter();

  public get Length() {
    return this.conditionsData.value.length;
  }

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.workGraphicComponent !== undefined) {
      this.workGraphicComponent.submitted = value;
    }

    if (this.salaryComponent !== undefined) {
      this.salaryComponent.submitted = value;
    }

    if (this.occurrenceComponent !== undefined) {
      this.occurrenceComponent.submitted = value;
    }

    if (this.addressComponent !== undefined) {
      this.addressComponent.submitted = value;
    }
  }

  public get Submitted() {
    return this.submitted;
  }

  public get Valid(): boolean {
    return this.submitted &&
      (this.workGraphicComponent === undefined ? true : this.workGraphicComponent.Valid) &&
      (this.salaryComponent === undefined ? true : this.salaryComponent.Valid) &&
      (this.occurrenceComponent === undefined ? true : this.occurrenceComponent.Valid) &&
      (this.addressComponent === undefined ? true : this.addressComponent.Valid) &&
      this.isFieldValid('conditions');
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit() {
  }

  public isFieldValid(name: string): boolean {
    if (this.canShowTotalLength(name)) {
      return this.totalLength <= this.getMaxTotalLength(name);
    } else {
      const maxLenght = this.getMaxLength(name);
      return maxLenght ? this.getLength() <= maxLenght : true;
    }
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(this.supplierId, this.formatData.id, name);
  }

  public canShowTotalLength(name: string): boolean {
    const totalLength = this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
    return totalLength ? true : false;
  }

  public getLength(): number {
    return this.conditionsData.value === null ? 0 : this.conditionsData.value.length;
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getMaxTotalLength(name: string): number {
    return this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
  }

  public onConditionsValueChanging($event: any): void {
    // const maxLength = this.getMaxLength('conditions');
    // if (maxLength <= this.advConditions.value.length) {
    //   $event.preventDefault();
    // }
  }

  public onConditionsChanged() {
    this.changed.emit();
  }
}
