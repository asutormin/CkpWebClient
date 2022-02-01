import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { TariffComponent } from '../tariff/tariff.component';
import { SupplierInfo } from '../../../_model/_input/supplier-info';
import { RubricInfo } from 'src/app/_model/_input/rubric-info';
import { TariffInfo } from 'src/app/_model/_input/tariff-info';
import { FormatTypeInfo } from 'src/app/_model/_input/format-type-info';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { PlacementComponent } from '../placement/placement.component';
import { SupplierService } from '../../../_services/supplier.service';
import { Subscription } from 'rxjs';
import { OrderPositionApiService } from '../../../_services/order-position.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { ApplyComponent } from '../apply/apply.component';
import { SharedService } from 'src/app/_services/shared.service';
import { OrderPositionService } from 'src/app/_services/order-position.service';
import { LogoData } from 'src/app/_model/_output/_string/logo-data';

@Component({
  selector: 'app-order-position',
  templateUrl: './order-position.component.html',
  styleUrls: ['./order-position.component.scss']
})
export class OrderPositionComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('placement', { static: true }) placementComponent: PlacementComponent;
  @ViewChild('tariff') tariffComponent: TariffComponent;
  @ViewChild('apply') applyComponent: ApplyComponent;

  private aSub: Subscription;
  private opSub: Subscription;
  private sSub: Subscription;
  private csSub: Subscription;
  private rSub: Subscription;
  private crSub: Subscription;
  private ftSub: Subscription;
  private cftSub: Subscription;
  private gSub: Subscription;
  private tSub: Subscription;
  private ctSub: Subscription;

  private prevSupplierId: number; // Выбранный ранее поставщик
  private prevFormatTypeId: number; // Выбранный ранее тип формата
  private prevFormatName: string; // Выбранное ранее название формата

  public orderPositionData: OrderPositionData;
  public submitted: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: UserService,
    private supplierService: SupplierService,
    private orderPositionService: OrderPositionService,
    private orderPositionApiService: OrderPositionApiService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    if (this.route.snapshot.params.id) {
      // Происходит изменение позиции
      this.opSub = this.orderPositionApiService.get(this.route.snapshot.params.id).subscribe(
        opd => {
          this.orderPositionData = opd;
          this.fillSuppliers();
          this.fillFormatTypes();
          this.fillTariffs();
          this.fillRubrics();

          this.fixCurrentSupplierId();
          this.fixCurrentFormatTypeId();
          this.fixCurrentFormatName();
        });
    } else if (this.sharedService.OrderPositionId) {
      // Происходит создание новой позиции на основе существующей
      this.opSub = this.orderPositionApiService.get(this.sharedService.OrderPositionId).subscribe(
        opd => {
          // Сбрасываем буфер
          this.sharedService.OrderPositionId = 0;
          this.orderPositionService.clearOrderPositionIds(opd);
          this.orderPositionService.clearOrderPositionGraphics(opd);
          this.orderPositionData = opd;
          this.fillSuppliers();
          this.fillFormatTypes();
          this.fillTariffs();
          this.fillRubrics();

          this.fixCurrentSupplierId();
          this.fixCurrentFormatTypeId();
          this.fixCurrentFormatName();
        });
    } else {
      // Создаём полностью новую позицию
      this.orderPositionData = new OrderPositionData();
      this.fillClient();
      this.fillSuppliers();

      this.fixCurrentSupplierId();
      this.fixCurrentFormatTypeId();
      this.fixCurrentFormatName();
    }
  }

  public ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
    if (this.opSub) {
      this.opSub.unsubscribe();
    }
    if (this.sSub) {
      this.sSub.unsubscribe();
    }
    if (this.csSub) {
      this.csSub.unsubscribe();
    }
    if (this.rSub) {
      this.rSub.unsubscribe();
    }
    if (this.crSub) {
      this.crSub.unsubscribe();
    }
    if (this.ftSub) {
      this.ftSub.unsubscribe();
    }
    if (this.cftSub) {
      this.cftSub.unsubscribe();
    }
    if (this.gSub) {
      this.gSub.unsubscribe();
    }
    if (this.tSub) {
      this.tSub.unsubscribe();
    }
    if (this.ctSub) {
      this.ctSub.unsubscribe();
    }
  }

  public onSupplierChanged($event: SupplierInfo): void {
    if (this.placementComponent)
      this.placementComponent.Submitted = false;

    if (this.tariffComponent)
      this.tariffComponent.Submitted = false;

    // Запоминаем текущий идентификатор поставщика
    this.fixCurrentSupplierId();

    this.orderPositionService.setSupplierId(this.orderPositionData, $event.id);
    this.orderPositionService.clearContentData(this.orderPositionData);

    this.onFormatTypeChanged(undefined);
  }

  public onFormatTypeChanged($event: FormatTypeInfo) {
    if (this.placementComponent)
      this.placementComponent.Submitted = false;

    if (this.tariffComponent)
      this.tariffComponent.Submitted = false;

    // Запоминаем текущий идентификатор типа формата
    this.fixCurrentFormatTypeId();

    this.orderPositionService.clearPriceId(this.orderPositionData);
    this.orderPositionService.createFormatData(this.orderPositionData);
    this.orderPositionService.clearGraphics(this.orderPositionData);
    this.orderPositionService.clearContentData(this.orderPositionData);
    this.orderPositionService.clearChilds(this.orderPositionData);

    this.placementComponent.setCurrentFormatType($event);

    this.onTariffChanged(undefined);
  }

  public onTariffChanged($event: TariffInfo): void {

    if (this.placementComponent)
      this.placementComponent.Submitted = false;

    if (this.tariffComponent)
      this.tariffComponent.Submitted = false;

    this.fixCurrentFormatName();

    this.onRubricChanged(undefined);

    this.orderPositionService.clearPriceId(this.orderPositionData);
    this.orderPositionService.createFormatData(this.orderPositionData);
    this.orderPositionService.clearChilds(this.orderPositionData);

    if ($event === undefined) return;

    // Перезаписываем информацию о цене и формате
    this.orderPositionService.setPriceId(this.orderPositionData, $event.price.id);
    this.orderPositionService.setFormatData(this.orderPositionData, $event.format);

    // Пересоздаём контент если первое изменение тарифа, либо изменены поставщик или тип формата
    if (this.orderPositionService.canReCreateContentData(this.orderPositionData, this.prevSupplierId, this.prevFormatTypeId)) {
      this.orderPositionService.clearContentData(this.orderPositionData);
      this.orderPositionService.createContentData(this.orderPositionData, $event.format);
    }
    
    // Сбрасываем логотип
    if (this.orderPositionService.canReCreateLogo(this.orderPositionData, this.prevFormatName, $event))
      this.orderPositionService.createLogo(this.orderPositionData.stringData);

    // Сбрасываем обязанности и условия
    if (this.orderPositionService.canClearResponsibilityAndCondition(this.orderPositionData, this.prevFormatName, $event)) {
      this.orderPositionService.clearResponsibility(this.orderPositionData.stringData);
      this.orderPositionService.clearConditionsValue(this.orderPositionData.stringData);
    }

    this.orderPositionService.createOrderPositionChilds(this.orderPositionData, $event);

    this.fixCurrentSupplierId();
    this.fixCurrentFormatTypeId();
    this.fixCurrentFormatName();
  }

  public onRubricChanged($event: RubricInfo): void {
    this.placementComponent.setCurrentRubric($event);
    this.orderPositionData.rubricData = $event;
  }

  public onSubmitted() {

    if (this.placementComponent) {
      this.placementComponent.Submitted = true;
    }
    if (this.tariffComponent) {
      this.tariffComponent.Submitted = true;
    }

    if (this.applyComponent) {
      this.applyComponent.valid = this.placementComponent.Valid && this.tariffComponent.Valid;
      if (!this.applyComponent.valid) {
        console.log('Данные введены не корректно.');
        console.log('this.placementComponent.Valid ', this.placementComponent.Valid);
        console.log('this.tariffComponent.Valid ', this.tariffComponent.Valid);
        return;
      } else {
        console.log('Данные введены корректно.');
        console.log(this.orderPositionData);

        if (this.orderPositionData.stringData) {
          if (!this.orderPositionData.stringData.phonesData ||
            (this.orderPositionData.stringData.phonesData && this.orderPositionData.stringData.phonesData.length == 0)) {
            alert("Не задано ни одного телефона.");
            return;
          }
        }
      }
    }

    if (this.orderPositionData.orderPositionId === 0) {
      this.orderPositionApiService.create(this.orderPositionData).subscribe(
        () => this.router.navigate(['/basket']));
    } else {
      this.orderPositionApiService.update(this.orderPositionData).subscribe(
        () => this.router.navigate(['/basket']));
    }
  }

  private fillClient(): void {
    this.aSub = this.authService.currentUser.subscribe(cu => {
      this.orderPositionData.clientId = cu.clientId;
      this.orderPositionData.clientLegalPersonId = cu.clientLegalPersonId;
    });
  };

  private fillSuppliers(): void {
    this.sSub = this.supplierService.getSuppliers().subscribe(
      suppliers => {
        if (this.orderPositionData.supplierId) {
          this.csSub = this.supplierService.getSupplier(this.orderPositionData.supplierId).subscribe(
            supplier => {
              let currentSupplier = suppliers.find(s => s.id === supplier.id);
              if (currentSupplier) {
                this.placementComponent.setCurrentSupplier(currentSupplier);
              } else {
                suppliers = [];
                currentSupplier = supplier;
                suppliers.push(currentSupplier);
              }
            });
        } else {
          this.placementComponent.setCurrentSupplier(undefined);
        }
        this.placementComponent.setSuppliers(suppliers);
      });
  }

  private fillFormatTypes(): void {
    this.ftSub = this.supplierService.getFormatTypes(this.orderPositionData.supplierId).subscribe(
      formatTypes => {
        if (this.orderPositionData.formatData.formatTypeId) {
          this.cftSub = this.supplierService.getFormatType(this.orderPositionData.formatData.formatTypeId).subscribe(
            formatType => {
              let currentFormatType = formatTypes.find(ft => ft.id === formatType.id);
              if (currentFormatType) {
                this.placementComponent.setCurrentFormatType(currentFormatType);
              } else {
                formatTypes = [];
                currentFormatType = formatType;
                formatTypes.push(currentFormatType);
              }
            });
        } else {
          this.placementComponent.setCurrentFormatType(undefined);
        }
        this.placementComponent.setFormatTypes(formatTypes);
      });
  }

  private fillTariffs(): void {
    // Получаем список тарифов
    this.tSub = this.supplierService.getTariffs(
      this.orderPositionData.supplierId, this.orderPositionData.formatData.formatTypeId).subscribe(tariffs => {
        // Если позиция новая
        if (this.orderPositionData.orderPositionId == 0) {
          let currentTariff = this.orderPositionService.getCurrentTariff(this.orderPositionData, tariffs);
          // Устанавливаем список тарифов
          this.placementComponent.setTariffs(tariffs);
          // Устанавливаем найденный тариф            
          this.placementComponent.setCurrentTariff(currentTariff);
        } else {
          // Если позиция старая - получаем версию тарифа
          this.ctSub = this.supplierService.getTariffVersion(
            this.orderPositionData.formatData.id, this.orderPositionData.formatData.version, this.orderPositionData.priceId).subscribe(
              tariff => {
                // Ищем версию тарифа в загруженном списке тарифов
                let currentTariff = tariffs.find(
                  t =>
                    t.format.id === tariff.format.id &&
                    t.format.version.getTime() === tariff.format.version.getTime() &&
                    t.price.id === tariff.price.id);
                // Если тариф не найден
                if (!currentTariff) {
                  tariffs = [];
                  currentTariff = tariff;
                  tariffs.push(currentTariff);
                }
                // Устанавливаем список тарифов
                this.placementComponent.setTariffs(tariffs);
                // Устанавливаем найденный тариф
                this.placementComponent.setCurrentTariff(currentTariff);
              });
          this.placementComponent.selectEnabled = false;
        }
      })
  }

  private fillRubrics(): void {
    this.rSub = this.supplierService.getRubrics(this.orderPositionData.priceId).subscribe(
      rubrics => {
        // Если позиция изменяется либо создаётся на основе существующей (задана рубрика)
        if (this.orderPositionData.rubricData && this.orderPositionData.rubricData.id) {
          // Загружаем рубрику
          this.crSub = this.supplierService.getRubricVersion(
            this.orderPositionData.rubricData.id, this.orderPositionData.rubricData.version).subscribe(
              rubric => {
                let currentRubric = rubrics.find(r => r.id === rubric.id);
                // Если рубрики нет в списке рубрик 
                // очищаем список и добавляем в него загруженную рубрику
                if (!currentRubric) {
                  rubrics = [];
                  currentRubric = rubric;
                  rubrics.push(currentRubric);
                }
                // Устанавливаем список рубрик и выбираем текущую
                this.placementComponent.setRubrics(rubrics);
                this.placementComponent.setCurrentRubric(currentRubric);
              });
        } else {
          // Если позиция новая - устанавливаем список рубрик
          // Текущую рубрику не выбираем
          this.placementComponent.setRubrics(rubrics);
          this.placementComponent.setCurrentRubric(undefined);
        }
      });
  }

  private fixCurrentSupplierId(): void {
    this.prevSupplierId = this.orderPositionService.getSupplierId(this.orderPositionData);
  }

  private fixCurrentFormatTypeId(): void {
    this.prevFormatTypeId = this.orderPositionService.getFormatTypeId(this.orderPositionData);
  }

  private fixCurrentFormatName(): void {
    this.prevFormatName = this.orderPositionService.getFormatName(this.orderPositionData);
  }
}
