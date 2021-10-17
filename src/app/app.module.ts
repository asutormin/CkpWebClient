import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './_components/main-layout/main-layout.component';
import { OrderPositionComponent } from './_components/_order-position/order-position/order-position.component';
import { ContactsComponent } from './_components/_order-position/_string/_contacts/contacts/contacts.component';
import { HeaderComponent } from './_components/_order-position/_string/_header/header/header.component';
import { GraphicsComponent } from './_components/_order-position/graphics/graphics.component';
import { PlacementComponent } from './_components/_order-position/placement/placement.component';
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule } from '@angular/forms';
import { ModuleComponent } from './_components/_order-position/_module/module/module.component';
import { PackageComponent } from './_components/_order-position/package/package.component';
import { PaginationComponent } from './_components/_shared/pagination/pagination.component';
import { ApplyComponent } from './_components/_order-position/apply/apply.component';
import { AccountsComponent } from './_components/_accounting/accounts/accounts.component';
import { AccountComponent } from './_components/_accounting/account/account.component';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import { BasketComponent } from './_components/basket/basket.component';
import { OrderPositionsComponent } from './_components/_order-position/order-positions/order-positions.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GraphicsStringifyPipe } from './_pipes/graphicsStringify.pipe';
import { RubricsStringifiedPipe } from './_pipes/rubricsStringified.pipe';
import { TariffComponent } from './_components/_order-position/tariff/tariff.component';
import { InputMaskAngularModule } from 'input-mask-angular';
import { ResponsibilitiesComponent } from './_components/_order-position/_string/_responsibilities/responsibilities/responsibilities.component';
import { RubricsComponent } from './_components/_order-position/rubrics/rubrics.component';
import { DateHttpInterceptor } from './_helpers/date.interceptor';
import { SalaryComponent } from './_components/_order-position/_string/_conditions/salary/salary.component';
import { ExperienceComponent } from './_components/_order-position/_string/_requirements/experience/experience.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BuilderComponent } from './_components/_order-position/_module/builder/builder.component';
import { PartBuilderComponent } from './_components/_order-position/_module/part-builder/part-builder.component';
import { UploadComponent } from './_components/_order-position/_module/upload/upload.component';
import { AddressComponent } from './_components/_order-position/_string/_conditions/address/address.component';
import { RequirementsComponent } from './_components/_order-position/_string/_requirements/requirements/requirements.component';
import { EducationComponent } from './_components/_order-position/_string/_requirements/education/education.component';
import { ConditionsComponent } from './_components/_order-position/_string/_conditions/conditions/conditions.component';
import { WorkGraphicComponent } from './_components/_order-position/_string/_conditions/work-graphic/work-graphic.component';
import { OccurrenceComponent } from './_components/_order-position/_string/_conditions/occurrence/occurrence.component';
import { PhonesComponent } from './_components/_order-position/_string/_contacts/phones/phones.component';
import { EmailComponent } from './_components/_order-position/_string/_contacts/email/email.component';
import { PersonComponent } from './_components/_order-position/_string/_contacts/person/person.component';
import { PhoneComponent } from './_components/_order-position/_string/_contacts/phone/phone.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { NgSelect2Module } from 'ng-select2';
import { LogoComponent } from './_components/_order-position/_string/_logo/logo/logo.component';
import { MaxFieldLengthValidateDirective } from './_validators/max-field-length.validator';
import { MaxSelect2LengthValidateDirective } from './_validators/max-select2-length.validator';
import { MaxSelect2CountValidateDirective } from './_validators/max-select2-count.validator';
import { WaitLineComponent } from './_components/_shared/wait-line/wait-line.component';
import { AccountPositionsComponent } from './_components/_accounting/account-positions/account-positions.component';
import { PositionsBasementComponent } from './_components/_shared/positions-basement/positions-basement.component';
import { BalanceComponent } from './_components/balance/balance.component';
import { HistoryComponent } from './_components/_history/history/history.component';
import { PreviewStringComponent } from './_components/_shared/preview-string/preview-string.component';
import { PreviewModuleComponent } from './_components/_shared/preview-module/preview-module.component';
import { PreviewPackageComponent } from './_components/_shared/preview-package/preview-package.component';
import { OwlModule } from 'ngx-owl-carousel';
import { PhoneMaskedComponent } from './_components/_order-position/_string/_contacts/phone-masked/phone-masked.component';
import { PhonesMaskedComponent } from './_components/_order-position/_string/_contacts/phones-masked/phones-masked.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    OrderPositionComponent,
    ContactsComponent,
    HeaderComponent,
    GraphicsComponent,
    PlacementComponent,
    ModuleComponent,
    PackageComponent,
    PaginationComponent,
    ApplyComponent,
    AccountsComponent,
    AccountComponent,
    LoginComponent,
    HomeComponent,
    BasketComponent,
    OrderPositionsComponent,
    GraphicsStringifyPipe,
    RubricsStringifiedPipe,
    TariffComponent,
    ResponsibilitiesComponent,
    RubricsComponent,
    SalaryComponent,
    ExperienceComponent,
    BuilderComponent,
    PartBuilderComponent,
    UploadComponent,
    AddressComponent,
    RequirementsComponent,
    EducationComponent,
    ConditionsComponent,
    WorkGraphicComponent,
    OccurrenceComponent,
    PhonesComponent,
    EmailComponent,
    PersonComponent,
    PhoneComponent,
    LogoComponent,
    MaxFieldLengthValidateDirective,
    MaxSelect2LengthValidateDirective,
    MaxSelect2CountValidateDirective,
    WaitLineComponent,
    AccountPositionsComponent,
    PositionsBasementComponent,
    BalanceComponent,
    HistoryComponent,
    PreviewStringComponent,
    PreviewModuleComponent,
    PreviewPackageComponent,
    PhoneMaskedComponent,
    PhonesMaskedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskAngularModule,
    NgxDropzoneModule,
    NgSelect2Module, 
    OwlModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
