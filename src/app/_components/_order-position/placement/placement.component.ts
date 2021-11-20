import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SupplierService } from '../../../_services/supplier.service';
import { SupplierInfo } from '../../../_model/_input/supplier-info';
import { RubricInfo } from '../../../_model/_input/rubric-info';
import { FormatTypeInfo } from '../../../_model/_input/format-type-info';
import { TariffInfo } from '../../../_model/_input/tariff-info';
import { RubricsComponent } from '../rubrics/rubrics.component';
import { NgForm } from '@angular/forms';
import { EventService, EventType } from 'src/app/_services/event.service';
import { GraphicService } from 'src/app/_services/graphic.service';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.scss']
})
export class PlacementComponent implements OnInit, OnDestroy {
  private tariffSubject: Subject<TariffInfo>;
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
    private supplierService: SupplierService,
    private graphicService: GraphicService,
    private eventService: EventService) {
    this.tariffSubject = new Subject<TariffInfo>();
  }

  public ngOnInit(): void {
    this.tariffSubject.subscribe(
      tariff => {
        if (tariff) {
          const weekDays = this.graphicService.getWeekdays();
          const formatDescription = tariff.format.description;
          if (weekDays.map(wd => wd.shortName).some(wd => formatDescription.indexOf(wd) >= 0)) {
            this.eventService.emit(EventType.Tariff_Changed, formatDescription, this);
          } else {
            this.eventService.emit(EventType.Tariff_Changed, null, this);
          }
        }
      })
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
    this.tariffSubject.next(tariff);
  }

  public onSupplierChanged(): void {
    this.Submitted = false;

    this.selectEnabled = false;
    this.ftSub = this.supplierService.getFormatTypes(this.currentSupplier.id).subscribe(formatTypes => {
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
    this.tSub = this.supplierService.getTariffs(this.currentSupplier.id, this.currentFormatType.id).subscribe(tariffs => {
      this.tariffs = tariffs;
      this.selectEnabled = true;
    });

    this.formatTypeChanged.emit(this.currentFormatType);

    this.currentTariff = undefined;
    this.onTariffChanged();
  }

  public onTariffChanged(): void {
    this.tariffChanged.emit(this.currentTariff);

    this.tariffSubject.next(this.currentTariff);

    if (this.currentTariff) {
      this.selectEnabled = false;
      this.rSub = this.supplierService.getRubrics(this.currentTariff.price.id).subscribe(rubrics => {
        if (this.rubricsComponent)
          this.rubricsComponent.setRubrics(rubrics);
        this.selectEnabled = true;
      });
    } else {
      if (this.rubricsComponent)
        this.rubricsComponent.setRubrics(undefined);
    }
  }
}
