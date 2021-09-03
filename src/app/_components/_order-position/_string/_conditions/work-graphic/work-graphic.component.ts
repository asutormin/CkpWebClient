import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkGraphicInfo } from '../../../../../_model/_input/work-graphic-info';
import { WorkGraphicData } from '../../../../../_model/_output/_string/_conditions/work-graphic-data';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../../../../_services/supplier.service';
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-work-graphic',
  templateUrl: './work-graphic.component.html',
  styleUrls: ['./work-graphic.component.scss']
})
export class WorkGraphicComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;

  private wSub: Subscription;

  @Input() public workGraphicData: WorkGraphicData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public workGraphics: WorkGraphicInfo[];
  public currentWorkGraphic: WorkGraphicInfo;
  public undefinedWorkGraphic: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private supplierService: SupplierService
  ) { }

  public ngOnInit(): void {
    this.wSub = this.supplierService.getWorkGraphicsHandbook(this.supplierId, this.formatData.formatTypeId)
      .subscribe(workGraphics => {
        this.workGraphics = workGraphics;
        this.currentWorkGraphic = workGraphics.find(wg => wg.id === this.workGraphicData.id);
      });
  }

  public ngOnDestroy(): void {
    if (this.wSub) {
      this.wSub.unsubscribe();
    }
  }

  public onWorkGraphicChanged(): void {
    this.workGraphicData.id = this.currentWorkGraphic.id;
  }
}
