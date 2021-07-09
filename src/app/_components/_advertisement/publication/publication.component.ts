import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {TariffComponent} from '../tariff/tariff.component';
import {Company} from '../../../_model/company';
import { Rubric } from 'src/app/_model/rubric';
import { Tariff } from 'src/app/_model/tariff';
import { FormatType } from 'src/app/_model/format-type';
import {AdvString} from '../../../_model/advertisement/string/adv-string';
import {Advertisement} from '../../../_model/advertisement/advertisement';
import {AdvFormat} from '../../../_model/advertisement/adv-format';
import {AdvertisementRubric} from '../../../_model/advertisement/advertisement-rubric';
import {PlacementComponent} from '../placement/placement.component';
import {SuppliersService} from '../../../_services/suppliers.service';
import {Subscription} from 'rxjs';
import {AdvContact} from '../../../_model/advertisement/string/adv-contact';
import {AdvModule} from '../../../_model/advertisement/module/adv-module';
import {AdvertisementsService} from '../../../_services/advertisements.service';
import {AdvOccurrence} from '../../../_model/advertisement/string/adv-occurrence';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../_services/auth.service';
import {ModulesService} from '../../../_services/modules.service';
import {ApplyComponent} from '../apply/apply.component';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('placement', {static: true}) placementComponent: PlacementComponent;
  @ViewChild('tariff') tariffComponent: TariffComponent;
  @ViewChild('apply') applyComponent: ApplyComponent;

  private aSub: Subscription;

  private sSub: Subscription;
  private csSub: Subscription;

  private rSub: Subscription;
  private crSub: Subscription;

  private ftSub: Subscription;
  private cftSub: Subscription;

  private gSub: Subscription;

  private tSub: Subscription;
  private ctSub: Subscription;


  public advertisement: Advertisement;
  public submitted: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private suppliersService: SuppliersService,
    private advertisementsService: AdvertisementsService,
    private moduleService: ModulesService,
    private cdRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {

    const loadAndBindClientInfo = () => {
      this.authService.currentUser.subscribe(cu => {
        this.advertisement.clientId = cu.clientId;
        this.advertisement.clientLegalPersonId = cu.clientLegalPersonId;
      });
    };

    const loadAndBindSuppliers = () => {
      this.sSub = this.suppliersService.getSuppliers().subscribe(
        suppliers => {
          if (this.advertisement.supplierId !== undefined) {
            this.csSub = this.suppliersService.getSupplier(this.advertisement.supplierId).subscribe(
              supplier => {
                let currentSupplier = suppliers.find(s => s.id === supplier.id);
                if (currentSupplier === undefined) {
                  suppliers = [];
                  currentSupplier = supplier;
                  suppliers.push(currentSupplier);
                }
                this.placementComponent.setCurrentSupplier(currentSupplier);
              });
          } else {
            this.placementComponent.setCurrentSupplier(undefined);
          }
          this.placementComponent.setSuppliers(suppliers);
        });
    };

    const loadAndBindFormatTypes = () => {
      this.ftSub = this.suppliersService.getFormatTypes(this.advertisement.supplierId).subscribe(
        formatTypes => {
          if (this.advertisement.format.formatTypeId !== undefined) {
            this.cftSub = this.suppliersService.getFormatType(this.advertisement.format.formatTypeId).subscribe(
              formatType => {
                let currentFormatType = formatTypes.find(ft => ft.id === formatType.id);
                if (currentFormatType === undefined) {
                  formatTypes = [];
                  currentFormatType = formatType;
                  formatTypes.push(currentFormatType);
                }
                this.placementComponent.setCurrentFormatType(currentFormatType);
              });
          } else {
            this.placementComponent.setCurrentFormatType(undefined);
          }
          this.placementComponent.setFormatTypes(formatTypes);
        });
    };

    const loadAndBindTariffs = () => {
      this.tSub = this.suppliersService.getTariffs(this.advertisement.supplierId, this.advertisement.format.formatTypeId).subscribe(
        tariffs => {
          if (
            this.advertisement.format.id !== undefined &&
            this.advertisement.format.version !== undefined &&
            this.advertisement.priceId !== undefined) {
            this.ctSub = this.suppliersService
              .getTariffVersion(this.advertisement.format.id, this.advertisement.format.version, this.advertisement.priceId).subscribe(
                tariff => {
                  let currentTariff = tariffs.find(
                    t =>
                      t.format.id === tariff.format.id &&
                      t.format.version.getTime() === tariff.format.version.getTime() &&
                      t.price.id === tariff.price.id);
                  if (currentTariff === undefined) {
                    tariffs = [];
                    currentTariff = tariff;
                    tariffs.push(currentTariff);
                  }
                  this.placementComponent.setCurrentTariff(currentTariff);
                });
          } else {
            this.placementComponent.setCurrentTariff(undefined);
          }
          this.placementComponent.setTariffs(tariffs);
        });

      // Если объявление не новое - запрещаем редактировать
      // информацию о размещении
      if (this.advertisement.orderPositionId !== 0) {
        this.placementComponent.selectEnabled = false;
      }
    };

    const loadAndBindRubrics = () => {
      this.rSub = this.suppliersService.getRubrics(this.advertisement.priceId).subscribe(
        rubrics => {
          if (this.advertisement.rubric.id !== undefined && this.advertisement.rubric.id !== 0) {
            this.crSub = this.suppliersService
              .getRubricVersion(this.advertisement.rubric.id, this.advertisement.rubric.version).subscribe(
              rubric => {
                let currentRubric = rubrics.find(r => r.id === rubric.id && r.version.getTime() === rubric.version.getTime());
                if (currentRubric === undefined) {
                  rubrics = [];
                  currentRubric = rubric;
                  rubrics.push(currentRubric);
                }
                this.placementComponent.setCurrentRubric(currentRubric);
              });
          } else {
            this.placementComponent.setCurrentRubric(undefined);
          }
          this.placementComponent.setRubrics(rubrics);
        });
    };

    const positionId = this.route.snapshot.params.id;
    console.log('OrderPositionId ', positionId);
    if (positionId === undefined) {
      this.advertisement = new Advertisement();
      loadAndBindClientInfo();
      loadAndBindSuppliers();
    } else {
      this.aSub = this.advertisementsService.getAdvertisement(positionId).subscribe(
        advertisement => {
          console.log(advertisement);
          this.advertisement = advertisement;
          loadAndBindSuppliers();
          loadAndBindFormatTypes();
          loadAndBindTariffs();
          loadAndBindRubrics();
        }
      );
    }
  }

  public ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
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

  public onSupplierChanged($event: Company): void {
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.advertisement.supplierId = $event.id;
    this.advertisement.string = undefined;
    this.advertisement.module = undefined;

    this.onFormatTypeChanged(undefined);
  }

  public onFormatTypeChanged($event: FormatType) {
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.advertisement.format = new AdvFormat();
    this.advertisement.priceId = 0;
    this.advertisement.childs = [];
    this.advertisement.string = undefined;
    this.advertisement.module = undefined;
    this.advertisement.graphics = [];

    this.placementComponent.setCurrentFormatType($event);

    this.onTariffChanged(undefined);
  }

  public onTariffChanged($event: Tariff): void {
    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = false;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = false;
    }

    this.onRubricChanged(undefined);

    this.advertisement.format = new AdvFormat();
    this.advertisement.priceId = 0;
    this.advertisement.childs = [];

    if ($event === undefined) {
      return;
    }

    this.advertisement.priceId = $event.price.id;
    this.advertisement.format.id = $event.format.id;
    this.advertisement.format.name = $event.format.name;
    this.advertisement.format.packageLength = $event.format.packageLength;
    this.advertisement.format.firstSize = $event.format.firstSize;
    this.advertisement.format.secondSize = $event.format.secondSize;
    this.advertisement.format.version = $event.format.version;
    this.advertisement.format.formatTypeId = $event.format.type.id;

    this.advertisement.module = undefined;
    this.advertisement.string = undefined;

    if ($event.format.type.id === 1) {
      this.advertisement.string = new AdvString();
      this.advertisement.string.contact = new AdvContact();
      this.advertisement.string.phones = [];
      this.advertisement.string.emails = [];
      this.advertisement.string.occurrences = [];
      this.advertisement.string.occurrences.push(new AdvOccurrence());
    }
    if ($event.format.type.id === 2) {
      this.advertisement.module = new AdvModule();
    }

    $event.packageTariffs.forEach(pt => {
      const child = this.createChildAdvertisement(
        this.advertisement.orderId, this.advertisement.clientId, this.advertisement.clientLegalPersonId, pt);
      this.advertisement.childs.push(child);
    });
  }

  public onRubricChanged($event: Rubric): void {
    this.placementComponent.setCurrentRubric($event);
    this.advertisement.rubric = $event;
  }

  public onSubmitted() {

    if (this.placementComponent !== undefined) {
      this.placementComponent.Submitted = true;
    }
    if (this.tariffComponent !== undefined) {
      this.tariffComponent.Submitted = true;
    }

    if (this.applyComponent !== undefined) {
      this.applyComponent.valid = this.placementComponent.Valid && this.tariffComponent.Valid;
      if (!this.applyComponent.valid) {
        console.log('Данные введены не корректно.');
        console.log('this.placementComponent.Valid ', this.placementComponent.Valid);
        console.log('this.tariffComponent.Valid ', this.tariffComponent.Valid);
        return;
      } else {
        console.log('Данные введены корректно.');
        console.log(this.advertisement);
      }
    }

    if (this.advertisement.orderPositionId === 0) {
      this.advertisementsService.createAdvertisement(this.advertisement).subscribe(
        () => this.router.navigate(['/shopping-cart']));
    } else {
      this.advertisementsService.updateAdvertisement(this.advertisement).subscribe(
        () => this.router.navigate(['/shopping-cart']));
    }
  }

  private createChildAdvertisement(orderId: number, clientId: number, clientLegalPersonId: number, tariff: Tariff): Advertisement {
    const advertisement = new Advertisement();
    advertisement.orderId = orderId;
    advertisement.supplierId = tariff.supplier.id;
    advertisement.priceId = tariff.price.id;
    advertisement.format.id = tariff.format.id;
    advertisement.format.name = tariff.supplier.name + ': ' + tariff.format.name;
    advertisement.format.packageLength = tariff.format.packageLength;
    advertisement.format.firstSize = tariff.format.firstSize;
    advertisement.format.secondSize = tariff.format.secondSize;
    advertisement.format.version = tariff.format.version;
    advertisement.format.formatTypeId = tariff.format.type.id;
    advertisement.rubric = new AdvertisementRubric();
    advertisement.clientId = clientId;
    advertisement.clientLegalPersonId = clientLegalPersonId;

    this.advertisement.string = undefined;
    this.advertisement.module = undefined;

    if (tariff.format.type.id === 1) {
      advertisement.string = new AdvString();
      advertisement.string.contact = new AdvContact();
      advertisement.string.phones = [];
      advertisement.string.emails = [];
      advertisement.string.occurrences = [];
      advertisement.string.occurrences.push(new AdvOccurrence());
      advertisement.string.addresses = [];
    }
    if (tariff.format.type.id === 2) {
      advertisement.module = new AdvModule();
    }

    return advertisement;
  }
}
