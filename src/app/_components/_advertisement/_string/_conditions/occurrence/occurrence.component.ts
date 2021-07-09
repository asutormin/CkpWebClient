import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Occurrence} from '../../../../../_model/occurrence';
import {AdvOccurrence} from '../../../../../_model/advertisement/string/adv-occurrence';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {Select2OptionData} from 'ng-select2';
import {Options} from 'select2';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-occurrence',
  templateUrl: './occurrence.component.html',
  styleUrls: ['./occurrence.component.scss']
})
export class OccurrenceComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;

  private oSub: Subscription;

  @Input() public advOccurrences: AdvOccurrence[];
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public occurrences: Array<Select2OptionData>;
  public options: Options;
  public selectedOccurrences: string[] = [];
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private suppliersService: SuppliersService,
    private stringConfigService: StringConfigService,
    private ref: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {

    this.options = {
      multiple: true,
      allowClear: true,
      // theme: 'classic',
      closeOnSelect: true,
    };

    this.oSub = this.suppliersService.getOccurrenciesHandbook(this.advSupplierId, this.advFormat.formatTypeId)
      .subscribe(occurrencies => {
        this.occurrences = occurrencies.map(o => ({ id: JSON.stringify(o), text: o.name }));
        this.advOccurrences.forEach(ao => {
          const occurrence = occurrencies.find(o => o.id === ao.id && o.typeId === ao.typeId);
          if (occurrence !== undefined) {
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
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public getMaxCount(name: string): any {
    return this.stringConfigService.getCount(this.advSupplierId, this.advFormat.id, name);
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
    //   alert(`местоположения занимают более ${maxLength} символов`);
    //   this.selectedOccurrences.length = 0;
    //   this.ref.detectChanges();
    // }

    this.advOccurrences.length = 0;

    this.selectedOccurrences.forEach(o => {
      const occurrence = JSON.parse(o) as Occurrence;
      if (occurrence !== undefined) {
        const advOccurrence = new AdvOccurrence();
        advOccurrence.id = occurrence.id;
        advOccurrence.typeId = occurrence.typeId;
        advOccurrence.orderBy = this.selectedOccurrences.indexOf(o);
        this.advOccurrences.push(advOccurrence);
      }
    } );
  }

}
