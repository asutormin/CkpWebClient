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
import { StringData } from '../../../_model/_output/_string/string-data';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { FormatData } from '../../../_model/_output/format-data';
import { RubricData } from '../../../_model/_output/rubric-data';
import { PlacementComponent } from '../placement/placement.component';
import { SupplierService } from '../../../_services/supplier.service';
import { Subscription } from 'rxjs';
import { ContactData } from '../../../_model/_output/_string/contact-data';
import { ModuleData } from '../../../_model/_output/_module/module-data';
import { OrderPositionService } from '../../../_services/order-position.service';
import { OccurrenceData } from '../../../_model/_output/_string/occurrence-data';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { ApplyComponent } from '../apply/apply.component';
import { SharedService } from 'src/app/_services/shared.service';

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


  public orderPositionData: OrderPositionData;
  public submitted: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: UserService,
    private supplierService: SupplierService,
    private orderPositionService: OrderPositionService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {

    const loadAndBindClientInfo = () => {
      this.aSub = this.authService.currentUser.subscribe(cu => {
        this.orderPositionData.clientId = cu.clientId;
        this.orderPositionData.clientLegalPersonId = cu.clientLegalPersonId;
      });
    };

    const loadAndBindSuppliers = () => {
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
    };

    const loadAndBindFormatTypes = () => {
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
    };

    const loadAndBindTariffs = () => {
      // Получаем список тарифов
      this.tSub = this.supplierService.getTariffs(
        this.orderPositionData.supplierId, this.orderPositionData.formatData.formatTypeId).subscribe(tariffs => {
          // Если позиция новая
          if (this.orderPositionData.orderPositionId == 0) {
            let currentTariff;
            // Если тариф задан - находим его в списке
            if (this.orderPositionData.formatData.id && this.orderPositionData.priceId) {
              let filteredTariffsByFormat = tariffs.filter(t => t.format.id === this.orderPositionData.formatData.id);
              if (filteredTariffsByFormat && filteredTariffsByFormat.length > 0) {
                let filteredTariffsByPrice = filteredTariffsByFormat.filter(t => t.price.id === this.orderPositionData.priceId);
                currentTariff = filteredTariffsByPrice && filteredTariffsByPrice.length > 0
                  ? filteredTariffsByPrice[0]
                  : filteredTariffsByFormat[0];
              }
            }
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
    };

    const loadAndBindRubrics = () => {
      this.rSub = this.supplierService.getRubrics(this.orderPositionData.priceId).subscribe(
        rubrics => {
          if (this.orderPositionData.rubricData && this.orderPositionData.rubricData.id) {
            this.crSub = this.supplierService
              .getRubricVersion(this.orderPositionData.rubricData.id, this.orderPositionData.rubricData.version).subscribe(
                rubric => {
                  let currentRubric = rubrics.find(r => r.id === rubric.id && r.version.getTime() === rubric.version.getTime());
                  if (currentRubric) {
                    this.placementComponent.setCurrentRubric(currentRubric);
                  } else {
                    rubrics = [];
                    currentRubric = rubric;
                    rubrics.push(currentRubric);
                  }
                });
          } else {
            this.placementComponent.setCurrentRubric(undefined);
          }
          this.placementComponent.setRubrics(rubrics);
        });
    };

    const resetIds = (opd: OrderPositionData) => {
      opd.orderId = 0;
      opd.orderPositionId = 0;
      opd.childs.forEach(c => resetIds(c));
    }

    const resetGraphics = (opd: OrderPositionData) => {
      opd.graphicsData = [];
      opd.childs.forEach(c => resetGraphics(c));
    }

    if (this.route.snapshot.params.id) {
      // Происходит изменение позиции
      this.opSub = this.orderPositionService.get(this.route.snapshot.params.id).subscribe(
        opd => {
          this.orderPositionData = opd;
          loadAndBindSuppliers();
          loadAndBindFormatTypes();
          loadAndBindTariffs();
          loadAndBindRubrics();
        });
    } else if (this.sharedService.OrderPositionId) {
      // Происходит создание новой позиции на основе существующей
      this.opSub = this.orderPositionService.get(this.sharedService.OrderPositionId).subscribe(
        opd => {
          // Сбрасываем буфер
          this.sharedService.OrderPositionId = 0;
          resetIds(opd);
          resetGraphics(opd);
          this.orderPositionData = opd;
          loadAndBindSuppliers();
          loadAndBindFormatTypes();
          loadAndBindTariffs();
          loadAndBindRubrics();
        });
    } else {
      // Создаём полностью новую позицию
      this.orderPositionData = new OrderPositionData();
      loadAndBindClientInfo();
      loadAndBindSuppliers();
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
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.orderPositionData.supplierId = $event.id;
    this.orderPositionData.stringData = undefined;
    this.orderPositionData.moduleData = undefined;

    this.onFormatTypeChanged(undefined);
  }

  public onFormatTypeChanged($event: FormatTypeInfo) {
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.orderPositionData.formatData = new FormatData();
    this.orderPositionData.priceId = 0;
    this.orderPositionData.childs = [];
    this.orderPositionData.stringData = undefined;
    this.orderPositionData.moduleData = undefined;
    this.orderPositionData.graphicsData = [];

    this.placementComponent.setCurrentFormatType($event);

    this.onTariffChanged(undefined);
  }

  public onTariffChanged($event: TariffInfo): void {
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.onRubricChanged(undefined);

    this.orderPositionData.formatData = new FormatData();
    this.orderPositionData.priceId = 0;
    this.orderPositionData.childs = [];

    if ($event === undefined) {
      return;
    }

    this.orderPositionData.priceId = $event.price.id;
    this.orderPositionData.formatData.id = $event.format.id;
    this.orderPositionData.formatData.name = $event.format.name;
    this.orderPositionData.formatData.packageLength = $event.format.packageLength;
    this.orderPositionData.formatData.firstSize = $event.format.firstSize;
    this.orderPositionData.formatData.secondSize = $event.format.secondSize;
    this.orderPositionData.formatData.version = $event.format.version;
    this.orderPositionData.formatData.formatTypeId = $event.format.type.id;

    this.orderPositionData.moduleData = undefined;
    this.orderPositionData.stringData = undefined;

    if ($event.format.type.id === 1) {
      this.orderPositionData.stringData = new StringData();
      this.orderPositionData.stringData.contactData = new ContactData();
      this.orderPositionData.stringData.phonesData = [];
      this.orderPositionData.stringData.emailsData = [];
      this.orderPositionData.stringData.occurrencesData = [];
      this.orderPositionData.stringData.occurrencesData.push(new OccurrenceData());
    }
    if ($event.format.type.id === 2) {
      this.orderPositionData.moduleData = new ModuleData();
    }

    $event.packageTariffs.forEach(pt => {
      const child = this.createChildAdvertisement(
        this.orderPositionData.orderId, this.orderPositionData.clientId, this.orderPositionData.clientLegalPersonId, pt);
      this.orderPositionData.childs.push(child);
    });
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
      this.orderPositionService.create(this.orderPositionData).subscribe(
        () => this.router.navigate(['/basket']));
    } else {
      this.orderPositionService.update(this.orderPositionData).subscribe(
        () => this.router.navigate(['/basket']));
    }
  }

  private createChildAdvertisement(orderId: number, clientId: number, clientLegalPersonId: number, tariff: TariffInfo): OrderPositionData {
    const advertisement = new OrderPositionData();
    advertisement.orderId = orderId;
    advertisement.supplierId = tariff.supplier.id;
    advertisement.priceId = tariff.price.id;
    advertisement.formatData.id = tariff.format.id;
    advertisement.formatData.name = tariff.supplier.name + ': ' + tariff.format.name;
    advertisement.formatData.packageLength = tariff.format.packageLength;
    advertisement.formatData.firstSize = tariff.format.firstSize;
    advertisement.formatData.secondSize = tariff.format.secondSize;
    advertisement.formatData.version = tariff.format.version;
    advertisement.formatData.formatTypeId = tariff.format.type.id;
    advertisement.rubricData = new RubricData();
    advertisement.clientId = clientId;
    advertisement.clientLegalPersonId = clientLegalPersonId;

    this.orderPositionData.stringData = undefined;
    this.orderPositionData.moduleData = undefined;

    if (tariff.format.type.id === 1) {
      advertisement.stringData = new StringData();
      advertisement.stringData.contactData = new ContactData();
      advertisement.stringData.phonesData = [];
      advertisement.stringData.emailsData = [];
      advertisement.stringData.occurrencesData = [];
      advertisement.stringData.occurrencesData.push(new OccurrenceData());
      advertisement.stringData.addressesData = [];
    }
    if (tariff.format.type.id === 2) {
      advertisement.moduleData = new ModuleData();
    }

    return advertisement;
  }
}
