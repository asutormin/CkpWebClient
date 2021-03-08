import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModuleParamsStandard} from '../../../../_model/advertisement/module/module-params-standard';
import {ModulesService} from '../../../../_services/modules.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AdvModule} from '../../../../_model/advertisement/module/adv-module';
import {Advertisement} from '../../../../_model/advertisement/advertisement';
import {PartBuilderComponent} from '../part-builder/part-builder.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
  @ViewChild('header', {static: true}) headerComponent: PartBuilderComponent;
  @ViewChild('body', {static: true}) bodyComponent: PartBuilderComponent;
  @ViewChild('footer', {static: true}) footerComponent: PartBuilderComponent;

  @Input() public advertisement: Advertisement;
  public sample: any;
  public moduleParamsStandard: ModuleParamsStandard;

  constructor(
    private sanitizer: DomSanitizer,
    private modulesService: ModulesService
  ) {  }

  public ngOnInit(): void {
    this.moduleParamsStandard = new ModuleParamsStandard();
  }

  public onBuildSample(): void {
    this.moduleParamsStandard.widthMM = this.advertisement.format.firstSize;
    this.moduleParamsStandard.heightMM = this.advertisement.format.secondSize;
    this.modulesService.buildSampleStandard(this.moduleParamsStandard).subscribe(s => {
      const sampleURL = 'data:image/jpeg;base64,' + s.base64String;
      this.sample = this.sanitizer.bypassSecurityTrustUrl(sampleURL);
      this.advertisement.module = this.sample;
    });
  }

  public clear(): void {
    this.advertisement.module = new AdvModule();
    this.sample = undefined;

    this.headerComponent.reset();
    this.bodyComponent.reset();
    this.footerComponent.reset();
  }
}
