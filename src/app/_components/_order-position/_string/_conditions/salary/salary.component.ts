import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseEntity } from '../../../../../_model/_input/base-entity';
import { CurrencyInfo } from '../../../../../_model/_input/currency-info';
import { SalaryData } from '../../../../../_model/_output/_string/_conditions/salary-data';
import { SupplierService } from '../../../../../_services/supplier.service';
import { Subscription } from 'rxjs';
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;

  private cSub: Subscription;

  @Input() public salaryData: SalaryData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;
  @Input() public orderPositionId: number;

  public submitted = false;

  public salaryTypes = [
    { id: 5, name: 'Договорная' },
    { id: 1, name: 'Фиксированная' },
    { id: 2, name: 'От' },
    { id: 3, name: 'До' },
    { id: 4, name: 'Диапазон' }
  ];
  public currentSalaryType: BaseEntity;

  public currencies: CurrencyInfo[];
  public currentCurrency: CurrencyInfo;
  public undefinedCurrency: any;

  public get salaryFixed(): number {
    return this.salaryData.from;
  }

  public set salaryFixed(salary: number) {
    this.salaryData.from = salary;
    this.salaryData.to = salary;
  }

  public get salaryFrom(): number {
    return this.salaryData.from;
  }

  public set salaryFrom(salary: number) {
    this.salaryData.from = salary;
    this.salaryData.to = undefined;
  }

  public get salaryTo(): number {
    return this.salaryData.to;
  }

  public set salaryTo(salary: number) {
    this.salaryData.from = undefined;
    this.salaryData.to = salary;
  }

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private supplierService: SupplierService
  ) { }

  ngOnInit() {

    this.cSub = this.supplierService.getCurrenciesHandbook()
      .subscribe(currencies => {
        this.currencies = currencies;
        this.currentCurrency = currencies.find(c => c.id === this.salaryData.currencyId);
      });

    if (this.salaryData.from && this.salaryData.to && this.salaryData.from === this.salaryData.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 1);
    } else if (this.salaryData.from && !this.salaryData.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 2);
    } else if (!this.salaryData.from && this.salaryData.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 3);
    } else if (this.salaryData.from && this.salaryData.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 4);
    } else if (!this.salaryData.from && !this.salaryData.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 5);
    } else {
        this.currentSalaryType = undefined;
    }     
    
  }

  public ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }

  public onSalaryTypeChanged(): void {
    this.salaryData.from = undefined;
    this.salaryData.to = undefined;
  }

  public onCurrencyChanged(): void {
    this.salaryData.currencyId = this.currentCurrency.id;
  }
}
