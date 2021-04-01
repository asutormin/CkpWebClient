import {
  Component,
  Input, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Advertisement} from '../../../_model/advertisement/advertisement';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../_services/suppliers.service';
import {RubricsComponent} from '../rubrics/rubrics.component';
import {GraphicsComponent} from '../graphics/graphics.component';
import {Rubric} from '../../../_model/rubric';
import {StringConfigService} from '../../../_services/string-config.service';
import {PackageComponent} from '../package/package.component';
import {HeaderComponent} from '../../_advertisement/_string/_header/header/header.component';
import {RequirementsComponent} from '../../_advertisement/_string/_requirements/requirements/requirements.component';
import {ResponsibilitiesComponent} from '../../_advertisement/_string/_responsibilities/responsibilities/responsibilities.component';
import {ConditionsComponent} from '../../_advertisement/_string/_conditions/conditions/conditions.component';
import {LogoComponent} from '../../_advertisement/_string/_logo/logo/logo.component';
import {ContactsComponent} from '../../_advertisement/_string/_contacts/contacts/contacts.component';
import {ModuleComponent} from '../../_advertisement/_module/module/module.component';


@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit, OnDestroy {

  @ViewChild('rubrics', {static: false}) private rubricsComponent: RubricsComponent;
  @ViewChild('graphics', {static: false}) private graphicsComponent: GraphicsComponent;
  @ViewChild('package', {static: false}) private packageComponent: PackageComponent;
  @ViewChild('header', {static: false}) private headerComponent: HeaderComponent;
  @ViewChild('requirements', {static: false}) private requirementsComponent: RequirementsComponent;
  @ViewChild('responsibilities', {static: false}) private responsibilitiesComponent: ResponsibilitiesComponent;
  @ViewChild('conditions', {static: false}) private conditionsComponent: ConditionsComponent;
  @ViewChild('logo', {static: false}) private logoComponent: LogoComponent;
  @ViewChild('contacts', {static: false}) private contactsComponent: ContactsComponent;
  @ViewChild('module', { static: false}) private moduleComponent: ModuleComponent;

  private rSub: Subscription;
  private crSub: Subscription;
  private rcSub: Subscription;
  private submitted = false;

  @Input() public advertisement: Advertisement;
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

  public get TotalLength(): number {
    const length =
      (this.requirementsComponent === undefined ? 0 : this.requirementsComponent.Length) +
      (this.conditionsComponent === undefined ? 0 : this.conditionsComponent.Length) +
      (this.responsibilitiesComponent === undefined ? 0 : this.responsibilitiesComponent.Length);
    return length;
  }

  constructor(
    private suppliersService: SuppliersService,
    private stringConfigService: StringConfigService
  ) {  }

  public ngOnInit(): void {
    if (!this.isPackage) {
      return;
    }

    this.rSub = this.suppliersService.getRubrics(this.advertisement.priceId).subscribe(
      rubrics => {
        this.rcSub = this.rubricsComponent.rubricChanged.subscribe(
          rubric => this.onPackageRubricChanged(rubric));

        if (this.advertisement.rubric.id !== undefined) {
          this.crSub = this.suppliersService.getRubricVersion(this.advertisement.rubric.id, this.advertisement.rubric.version).subscribe(
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
      this.advertisement.supplierId, this.advertisement.format.id, name);
  }

  public onPackageRubricChanged($event: Rubric) {
    console.log($event);
    this.advertisement.rubric.id = $event.id;
    this.advertisement.rubric.version = $event.version;
  }

  onFieldChanged() {
    const length =
      (this.requirementsComponent === undefined ? 0 : this.requirementsComponent.Length) +
      (this.conditionsComponent === undefined ? 0 : this.conditionsComponent.Length) +
      (this.responsibilitiesComponent === undefined ? 0 : this.responsibilitiesComponent.Length);

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
