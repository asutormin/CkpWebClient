import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Advertisement} from '../../../../_model/advertisement/advertisement';
import {UploadComponent} from '../upload/upload.component';
import {BuilderComponent} from '../builder/builder.component';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {
  @ViewChild('upload') uploadComponent: UploadComponent;
  @ViewChild('builder') builderComponent: BuilderComponent;

  private submitted = false;

  @Input() public Advertisement: Advertisement;

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.uploadComponent !== undefined) {
      this.uploadComponent.submitted = value;
    }
  }

  public get Valid() {
    return this.submitted &&
      (this.uploadComponent === undefined ? true : this.uploadComponent.Valid);
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
