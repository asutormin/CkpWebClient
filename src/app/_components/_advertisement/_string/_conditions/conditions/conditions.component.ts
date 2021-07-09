import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Advertisement} from '../../../../../_model/advertisement/advertisement';
import {SalaryComponent} from '../salary/salary.component';
import {WorkGraphicComponent} from '../work-graphic/work-graphic.component';
import {OccurrenceComponent} from '../occurrence/occurrence.component';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {AdvConditions} from '../../../../../_model/advertisement/string/conditions/adv-conditions';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {AdvOccurrence} from '../../../../../_model/advertisement/string/adv-occurrence';
import {AdvAddress} from '../../../../../_model/advertisement/string/adv-address';
import {AddressComponent} from '../address/address.component';
import {NgForm} from '@angular/forms';

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

  @Input() public advConditions: AdvConditions;
  @Input() public advOccurrencies: AdvOccurrence[];
  @Input() public advAddresses: AdvAddress[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;
  @Input() public advOrderPositionId: number;
  @Input() public totalLength = 0;

  @Output() public changed = new EventEmitter();

  public get Length() {
    return this.advConditions.value.length;
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
      return  this.totalLength <= this.getMaxTotalLength(name);
    } else {
      const maxLenght = this.getMaxLength(name);
      return maxLenght ? this.getLength() <= maxLenght : true;
    }
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(this.advSupplierId, this.advFormat.id, name);
  }

  public canShowTotalLength(name: string): boolean {
    const totalLength = this.stringConfigService.getTotalLength(this.advSupplierId, this.advFormat.id, name);
    return totalLength ? true : false;
  }

  public getLength(): number {
    return this.advConditions.value === null ? 0 : this.advConditions.value.length;
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public getMaxTotalLength(name: string): number {
    return  this.stringConfigService.getTotalLength(this.advSupplierId, this.advFormat.id, name);
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
