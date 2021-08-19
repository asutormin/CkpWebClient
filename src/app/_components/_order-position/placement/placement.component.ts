import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuppliersService } from '../../../_services/suppliers.service';
import { SupplierInfo } from '../../../_model/_input/supplier-info';
import { RubricInfo } from '../../../_model/_input/rubric-info';
import { FormatTypeInfo } from '../../../_model/_input/format-type-info';
import { TariffInfo } from '../../../_model/_input/tariff-info';
import { RubricsComponent } from '../rubrics/rubrics.component';
import { NgForm } from '@angular/forms';

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

  @Output() public supplierChanged = new EventEmitter<SupplierInfo>();
  @Output() public rubricChanged = new EventEmitter<RubricInfo>();
  @Output() public formatTypeChanged = new EventEmitter<FormatTypeInfo>();
  @Output() public tariffChanged = new EventEmitter<TariffInfo>();

  public selectEnabled = true;

  public get Valid(): boolean {
    return this.submitted && !this.form.invalid &&
      (this.rubricsComponent === undefined || this.rubricsComponent.Valid);
  }

  public suppliers: SupplierInfo[];
  public currentSupplier: SupplierInfo;
  public undefinedSupplier: any;

  public formatTypes: FormatTypeInfo[];
  public currentFormatType: FormatTypeInfo;
  public undefinedFormatType: any;

  public tariffs: TariffInfo[];
  public currentTariff: TariffInfo;
  public undefinedTariff: any;

  constructor(
    private suppliersService: SuppliersService) { }

  public setSuppliers(suppliers: SupplierInfo[]): void {
    this.suppliers = suppliers;
  }

  public setCurrentSupplier(supplier: SupplierInfo): void {
    this.currentSupplier = supplier;
  }

  public setRubrics(rubrics: RubricInfo[]): void {
    if (this.rubricsComponent) {
      this.rubricsComponent.setRubrics(rubrics);
    }
  }

  public setCurrentRubric(rubric: RubricInfo): void {
    if (this.rubricsComponent) {
      this.rubricsComponent.setCurrentRubric(rubric);
    }
  }

  public setFormatTypes(formatTypes: FormatTypeInfo[]): void {
    this.formatTypes = formatTypes;
  }

  public setCurrentFormatType(formatType: FormatTypeInfo): void {
    this.currentFormatType = formatType;
  }

  public setTariffs(tariffs: TariffInfo[]): void {
    this.tariffs = tariffs;
  }

  public setCurrentTariff(tariff: TariffInfo) {
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

  public onRubricChanged($event: RubricInfo): void {
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
