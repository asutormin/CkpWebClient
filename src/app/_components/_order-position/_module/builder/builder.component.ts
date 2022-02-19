import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModuleParamsStandard } from '../../../../_model/_output/_module/module-params-standard';
import { ModuleService } from '../../../../_services/module.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModuleData } from '../../../../_model/_output/_module/module-data';
import { OrderPositionData } from '../../../../_model/_output/order-position-data';
import { PartBuilderComponent } from '../part-builder/part-builder.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
  @ViewChild('header', { static: true }) headerComponent: PartBuilderComponent;
  @ViewChild('body', { static: true }) bodyComponent: PartBuilderComponent;
  @ViewChild('footer', { static: true }) footerComponent: PartBuilderComponent;

  @Input() public orderPositionData: OrderPositionData;
  public sample: any;
  public moduleParamsStandard: ModuleParamsStandard;

  public get Valid(): boolean {
    return this.sample;
  }

  constructor(
    private sanitizer: DomSanitizer,
    private modulesService: ModuleService
  ) { }

  public ngOnInit(): void {
    this.moduleParamsStandard = new ModuleParamsStandard();
  }

  public onBuildSample(): void {
    this.moduleParamsStandard.widthMM = this.orderPositionData.formatData.firstSize;
    this.moduleParamsStandard.heightMM = this.orderPositionData.formatData.secondSize;
    this.modulesService.buildSampleStandard(this.moduleParamsStandard).subscribe(s => {
      const sampleURL = 'data:image/jpeg;base64,' + s.base64String;
      this.sample = (this.sanitizer.bypassSecurityTrustResourceUrl(sampleURL) as any).changingThisBreaksApplicationSecurity;
      this.orderPositionData.moduleData.base64String = this.sample;
      this.orderPositionData.moduleData.name = "Sample.tif"
    });
  }

  public clear(): void {
    this.orderPositionData.moduleData = new ModuleData();
    this.sample = undefined;

    this.headerComponent.reset();
    this.bodyComponent.reset();
    this.footerComponent.reset();
  }
}
