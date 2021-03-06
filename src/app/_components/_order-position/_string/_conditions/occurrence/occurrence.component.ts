import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OccurrenceInfo } from '../../../../../_model/_input/occurrence-info';
import { OccurrenceData } from '../../../../../_model/_output/_string/occurrence-data';
import { Subscription } from 'rxjs';

import { FormatData } from '../../../../../_model/_output/format-data';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgForm } from '@angular/forms';
import { SupplierService } from 'src/app/_services/supplier.service';

@Component({
  selector: 'app-occurrence',
  templateUrl: './occurrence.component.html',
  styleUrls: ['./occurrence.component.scss']
})
export class OccurrenceComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;

  private oSub: Subscription;

  @Input() public occurrencesData: OccurrenceData[];
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public occurrences: Array<Select2OptionData>;
  public options: Options;
  public selectedOccurrences: string[] = [];
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && 
      this.form.valid && 
      this.occurrencesData.length > 0 &&
      this.occurrencesData.findIndex(o => o.id > 0) >= 0;
  }

  constructor(
    private supplierService: SupplierService,
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {

    this.options = {
      multiple: true,
      allowClear: true,
      // theme: 'classic',
      closeOnSelect: true,
    };

    this.oSub = this.supplierService.getOccurrenciesHandbook(this.supplierId)
      .subscribe(occurrences => {
        this.occurrences = occurrences.map(o => ({ id: JSON.stringify(o), text: o.name }));
        this.occurrencesData.forEach(ao => {
          const occurrence = occurrences.find(o => o.id === ao.id && o.typeId === ao.typeId);
          if (occurrence) {
            this.selectedOccurrences.push(JSON.stringify(occurrence));
          }
        });
      });
  }

  public ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getMaxCount(name: string): any {
    return this.stringConfigService.getCount(this.supplierId, this.formatData.id, name);
  }

  public getLength(): number {
    let length = 0;
    this.selectedOccurrences.forEach(o => { length += JSON.parse(o).name.length; });
    return length;
  }

  public onOccurrenceChanged($event: any): void {
    // const maxLength = this.getMaxLength('occurrence');
    // const length = this.getLength();

    // if (maxLength <= length) {
    //   alert(`???????????????????????????? ???????????????? ?????????? ${maxLength} ????????????????`);
    //   this.selectedOccurrences.length = 0;
    //   this.ref.detectChanges();
    // }

    this.occurrencesData.length = 0;

    this.selectedOccurrences.forEach(o => {
      const occurrence = JSON.parse(o) as OccurrenceInfo;
      if (occurrence) {
        const occurrenceData = new OccurrenceData();
        occurrenceData.id = occurrence.id;
        occurrenceData.typeId = occurrence.typeId;
        occurrenceData.orderBy = this.selectedOccurrences.indexOf(o);
        this.occurrencesData.push(occurrenceData);
      }
    });
  }

}
