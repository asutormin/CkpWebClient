import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OrderPositionData } from '../../../../_model/_output/order-position-data';
import { UploadComponent } from '../upload/upload.component';
import { BuilderComponent } from '../builder/builder.component';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {
  @ViewChild('upload') uploadComponent: UploadComponent;
  @ViewChild('builder') builderComponent: BuilderComponent;

  private submitted = false;

  @Input() public orderPositionData: OrderPositionData;

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.uploadComponent !== undefined) {
      this.uploadComponent.submitted = value;
    }
  }

  public get Valid() {
    return this.submitted &&
      (
        (this.uploadComponent ? this.uploadComponent.Valid : false) || 
        (this.builderComponent ? this.builderComponent.Valid : false));
  }

  constructor(
  ) { }

  public ngOnInit(): void {
  }

  public onTabChanged(): void {
    this.uploadComponent.clear();
    this.builderComponent.clear();
  }
}
