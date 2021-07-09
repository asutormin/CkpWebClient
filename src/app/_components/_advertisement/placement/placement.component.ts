import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../_services/suppliers.service';
import {Company} from '../../../_model/company';
import {Rubric} from '../../../_model/rubric';
import {FormatType} from '../../../_model/format-type';
import {Tariff} from '../../../_model/tariff';
import {RubricsComponent} from '../rubrics/rubrics.component';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.scss']
})
export class PlacementComponent implements OnInit, OnDestroy {
  private sSub: Subscription;
  private rSub: Subscription;
  private ftSub: Subscription;
  private tSub: Subscription;
  private submitted = false;

  @ViewChild('f') private form: NgForm;
  @ViewChild('rubrics') private rubricsComponent: RubricsComponent;

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.rubricsComponent) {
      this.rubricsComponent.submitted = value;
    }
  }

  public get Submitted() {
    return this.submitted;
  }

  @Output() public supplierChanged = new EventEmitter<Company>();
  @Output() public rubricChanged = new EventEmitter<Rubric>();
  @Output() public formatTypeChanged = new EventEmitter<FormatType>();
  @Output() public tariffChanged = new EventEmitter<Tariff>();

  public selectEnabled = true;

  public get Valid(): boolean {
    return  this.submitted && !this.form.invalid &&
      (this.rubricsComponent === undefined || this.rubricsComponent.Valid);
  }

  public suppliers: Company[];
  public currentSupplier: Company;
  public undefinedSupplier: any;

  public formatTypes: FormatType[];
  public currentFormatType: FormatType;
  public undefinedFormatType: any;

  public tariffs: Tariff[];
  public currentTariff: Tariff;
  public undefinedTariff: any;

  constructor(
    private suppliersService: SuppliersService) { }

  public setSuppliers(suppliers: Company[]): void {
    this.suppliers = suppliers;
  }

  public setCurrentSupplier(supplier: Company): void {
    this.currentSupplier = supplier;
  }

  public setRubrics(rubrics: Rubric[]): void {
    if (this.rubricsComponent) {
      this.rubricsComponent.setRubrics(rubrics);
    }
  }

  public setCurrentRubric(rubric: Rubric): void {
    if (this.rubricsComponent) {
      this.rubricsComponent.setCurrentRubric(rubric);
    }
  }

  public setFormatTypes(formatTypes: FormatType[]): void {
    this.formatTypes = formatTypes;
  }

  public setCurrentFormatType(formatType: FormatType): void {
    this.currentFormatType = formatType;
  }

  public setTariffs(tariffs: Tariff[]): void {
    this.tariffs = tariffs;
  }

  public setCurrentTariff(tariff: Tariff) {
    this.currentTariff = tariff;
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    if (this.sSub) {
      this.sSub.unsubscribe();
    }
    if (this.rSub) {
      this.rSub.unsubscribe();
    }
    if (this.ftSub) {
      this.ftSub.unsubscribe();
    }
    if (this.tSub) {
      this.tSub.unsubscribe();
    }
  }

  public onSupplierChanged(): void {
    this.Submitted = false;

    this.selectEnabled = false;
    this.ftSub = this.suppliersService.getFormatTypes(this.currentSupplier.id).subscribe(formatTypes => {
      this.formatTypes = formatTypes;
      this.selectEnabled = true;
    });

    this.supplierChanged.emit(this.currentSupplier);

    this.currentTariff = undefined;
    this.onTariffChanged();
  }

  public onRubricChanged($event: Rubric): void {
    this.rubricChanged.emit($event);
  }

  public onFormatTypeChanged(): void {
    this.selectEnabled = false;
    this.tSub = this.suppliersService.getTariffs(this.currentSupplier.id, this.currentFormatType.id).subscribe(tariffs => {
      this.tariffs = tariffs;
      this.selectEnabled = true;
    });

    this.formatTypeChanged.emit(this.currentFormatType);

    this.currentTariff = undefined;
    this.onTariffChanged();
  }

  public onTariffChanged(): void {
    this.tariffChanged.emit(this.currentTariff);
    if (this.currentTariff === undefined) {
      if (this.rubricsComponent) {
        this.rubricsComponent.setRubrics(undefined);
      }
    } else {
      this.selectEnabled = false;
      this.rSub = this.suppliersService.getRubrics(this.currentTariff.price.id).subscribe(rubrics => {
        if (this.rubricsComponent) {
          this.rubricsComponent.setRubrics(rubrics);
        }
        this.selectEnabled = true;
      });
    }
  }
}
