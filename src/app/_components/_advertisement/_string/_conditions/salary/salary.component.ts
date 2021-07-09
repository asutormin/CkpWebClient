import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseEntity} from '../../../../../_model/base-entity';
import {Currency} from '../../../../../_model/currency';
import {AdvSalary} from '../../../../../_model/advertisement/string/conditions/adv-salary';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {Subscription} from 'rxjs';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;

  private cSub: Subscription;

  @Input() public advSalary: AdvSalary;
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;
  @Input() public advOrderPositionId: number;

  public submitted = false;

  public salaryTypes = [
    { id: 1, name: 'Фиксированная'},
    { id: 2, name: 'От'},
    { id: 3, name: 'До'},
    { id: 4, name: 'Диапазон'},
    { id: 5, name: 'Договорная'}
  ];
  public currentSalaryType: BaseEntity;
  public undefinedSalaryType: any;

  public currencies: Currency[];
  public currentCurrency: Currency;
  public undefinedCurrency: any;

  public get salaryFixed(): number {
    return this.advSalary.from;
  }

  public set salaryFixed(salary: number) {
    this.advSalary.from = salary;
    this.advSalary.to = salary;
  }

  public get salaryFrom(): number {
    return this.advSalary.from;
  }

  public set salaryFrom(salary: number) {
    this.advSalary.from = salary;
    this.advSalary.to = undefined;
  }

  public get salaryTo(): number {
    return this.advSalary.to;
  }

  public set salaryTo(salary: number) {
    this.advSalary.from = undefined;
    this.advSalary.to = salary;
  }

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private suppliersService: SuppliersService
  ) { }

  ngOnInit() {

    this.cSub = this.suppliersService.getCurrenciesHandbook(this.advSupplierId, this.advFormat.formatTypeId)
      .subscribe(currencies => {
        this.currencies = currencies;
        this.currentCurrency = currencies.find(c => c.id === this.advSalary.currencyId);
      });

    if (this.advSalary.from !== undefined && this.advSalary.to !== undefined && this.advSalary.from === this.advSalary.to) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 1);
    } else if (this.advSalary.from !== undefined && this.advSalary.to === undefined) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 2);
    } else if (this.advSalary.from === undefined && this.advSalary.to !== undefined) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 3);
    } else if (this.advSalary.from !== undefined && this.advSalary.to !== undefined) {
      this.currentSalaryType = this.salaryTypes.find(st => st.id === 4);
    } else if (this.advSalary.from === undefined && this.advSalary.to === undefined) {
      if (this.advOrderPositionId !== 0) {
        this.currentSalaryType = this.salaryTypes.find(st => st.id === 5);
      } else {
        this.currentSalaryType = undefined;
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }

  public onSalaryTypeChanged(): void {
    this.advSalary.from = undefined;
    this.advSalary.to = undefined;
  }

  public onCurrencyChanged(): void {
    this.advSalary.currencyId = this.currentCurrency.id;
  }
}
