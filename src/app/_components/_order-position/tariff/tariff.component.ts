import {
  Component,
  Input, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { Subscription } from 'rxjs';
import { SuppliersService } from '../../../_services/suppliers.service';
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
export class TariffComponent implements OnInit, OnDestroy {

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
      (this.rubricsComponent === undefined ? true : this.rubricsComponent.Valid) &&
      (this.packageComponent === undefined ? true : this.packageComponent.Valid) &&
      (this.graphicsComponent === undefined ? true : this.graphicsComponent.Valid) &&
      (this.headerComponent === undefined ? true : this.headerComponent.Valid) &&
      (this.requirementsComponent === undefined ? true : this.requirementsComponent.Valid) &&
      (this.responsibilitiesComponent === undefined ? true : this.responsibilitiesComponent.Valid) &&
      (this.conditionsComponent === undefined ? true : this.conditionsComponent.Valid) &&
      (this.logoComponent === undefined ? true : this.logoComponent.Valid) &&
      (this.contactsComponent === undefined ? true : this.contactsComponent.Valid) &&
      (this.moduleComponent === undefined ? true : this.moduleComponent.Valid);
  }

  constructor(
    private suppliersService: SuppliersService,
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
    if (!this.isPackage) {
      return;
    }

    this.rSub = this.suppliersService.getRubrics(this.orderPositionData.priceId).subscribe(
      rubrics => {
        this.rcSub = this.rubricsComponent.rubricChanged.subscribe(
          rubric => this.onPackageRubricChanged(rubric));

        if (this.orderPositionData.rubricData.id !== undefined) {
          this.crSub = this.suppliersService.getRubricVersion(this.orderPositionData.rubricData.id, this.orderPositionData.rubricData.version).subscribe(
            rubric => {
              let currentRubric = rubrics.find(r => r.id === rubric.id && r.version.getTime() === rubric.version.getTime());
              if (currentRubric === undefined) {
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
