import {
  AfterViewInit,
  Component,
  Input, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../../_services/supplier.service';
import { RubricsComponent } from '../rubrics/rubrics.component';
import { GraphicsComponent } from '../graphics/graphics.component';
import { RubricInfo } from '../../../_model/_input/rubric-info';
import { StringConfigService } from '../../../_services/string-config.service';
import { PackageComponent } from '../package/package.component';
import { HeaderComponent } from '../../_order-position/_string/_header/header/header.component';
import { RequirementsComponent } from '../../_order-position/_string/_requirements/requirements/requirements.component';
import { ResponsibilitiesComponent } from '../../_order-position/_string/_responsibilities/responsibilities/responsibilities.component';
import { ConditionsComponent } from '../../_order-position/_string/_conditions/conditions/conditions.component';
import { LogoComponent } from '../../_order-position/_string/_logo/logo/logo.component';
import { ContactsComponent } from '../../_order-position/_string/_contacts/contacts/contacts.component';
import { ModuleComponent } from '../../_order-position/_module/module/module.component';


@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('rubrics') private rubricsComponent: RubricsComponent;
  @ViewChild('graphics') private graphicsComponent: GraphicsComponent;
  @ViewChild('package') private packageComponent: PackageComponent;
  @ViewChild('header') private headerComponent: HeaderComponent;
  @ViewChild('requirements') private requirementsComponent: RequirementsComponent;
  @ViewChild('responsibilities') private responsibilitiesComponent: ResponsibilitiesComponent;
  @ViewChild('conditions') private conditionsComponent: ConditionsComponent;
  @ViewChild('logo') private logoComponent: LogoComponent;
  @ViewChild('contacts') private contactsComponent: ContactsComponent;
  @ViewChild('module') private moduleComponent: ModuleComponent;

  private rSub: Subscription;
  private crSub: Subscription;
  private rcSub: Subscription;
  private submitted = false;

  @Input() public orderPositionData: OrderPositionData;
  @Input() public isPackage: boolean;

  @Input() public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.rubricsComponent !== undefined) {
      this.rubricsComponent.submitted = value;
    }

    if (this.packageComponent !== undefined) {
      this.packageComponent.Submitted = value;
    }

    if (this.graphicsComponent !== undefined) {
      this.graphicsComponent.submitted = value;
    }

    if (this.headerComponent !== undefined) {
      this.headerComponent.submitted = value;
    }

    if (this.requirementsComponent !== undefined) {
      this.requirementsComponent.Submitted = value;
    }

    if (this.responsibilitiesComponent !== undefined) {
      this.responsibilitiesComponent.submitted = value;
    }

    if (this.conditionsComponent !== undefined) {
      this.conditionsComponent.Submitted = value;
    }

    if (this.logoComponent !== undefined) {
      this.logoComponent.submitted = value;
    }

    if (this.contactsComponent !== undefined) {
      this.contactsComponent.Submitted = value;
    }

    if (this.moduleComponent !== undefined) {
      this.moduleComponent.Submitted = value;
    }
  }

  public get Valid(): boolean {
    return this.submitted &&
      (this.rubricsComponent ? this.rubricsComponent.Valid : true) &&
      (this.packageComponent ? this.packageComponent.Valid : true) &&
      (this.graphicsComponent ? this.graphicsComponent.Valid : true) &&
      (this.headerComponent ? this.headerComponent.Valid : true) &&
      (this.requirementsComponent ? this.requirementsComponent.Valid : true) &&
      (this.responsibilitiesComponent ? this.responsibilitiesComponent.Valid : true) &&
      (this.conditionsComponent ? this.conditionsComponent.Valid : true) &&
      (this.logoComponent ? this.logoComponent.Valid : true) &&
      (this.contactsComponent ? this.contactsComponent.Valid : true) &&
      (this.moduleComponent ? this.moduleComponent.Valid : true);
  }

  constructor(
    private supplierService: SupplierService,
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (!this.isPackage) {
      return;
    }

    this.rSub = this.supplierService.getRubrics(this.orderPositionData.priceId).subscribe(
      rubrics => {
        this.rcSub = this.rubricsComponent.rubricChanged.subscribe(
          rubric => this.onPackageRubricChanged(rubric));

        if (this.orderPositionData.rubricData.id) {
          this.crSub = this.supplierService.getRubricVersion(this.orderPositionData.rubricData.id, this.orderPositionData.rubricData.version).subscribe(
            rubric => {
              let currentRubric = rubrics.find(r => r.id === rubric.id);
              if (!currentRubric) {
                rubrics = [];
                currentRubric = rubric;
                rubrics.push(currentRubric);
              }
              this.rubricsComponent.setCurrentRubric(currentRubric);
            });
        } else {
          this.rubricsComponent.setCurrentRubric(undefined);
        }
        this.rubricsComponent.setRubrics(rubrics);
      });
  }

  ngAfterViewInit(): void {
    this.onFieldChanged();
  }

  public ngOnDestroy(): void {
    if (this.rSub) {
      this.rSub.unsubscribe();
    }
    if (this.crSub) {
      this.crSub.unsubscribe();
    }
    if (this.crSub) {
      this.crSub.unsubscribe();
    }
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(
      this.orderPositionData.supplierId, this.orderPositionData.formatData.id, name);
  }

  public onPackageRubricChanged($event: RubricInfo) {
    console.log($event);
    this.orderPositionData.rubricData.id = $event.id;
    this.orderPositionData.rubricData.version = $event.version;
  }

  onFieldChanged() {
    const length =
      (this.requirementsComponent ? this.requirementsComponent.Length : 0) +
      (this.conditionsComponent ? this.conditionsComponent.Length : 0) +
      (this.responsibilitiesComponent ? this.responsibilitiesComponent.Length : 0);

    if (this.requirementsComponent) {
      this.requirementsComponent.totalLength = length;
    }
    if (this.conditionsComponent) {
      this.conditionsComponent.totalLength = length;
    }
    if (this.responsibilitiesComponent) {
      this.responsibilitiesComponent.totalLength = length;
    }
  }
}
