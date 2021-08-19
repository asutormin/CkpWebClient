import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { FormatData } from '../../../../../_model/_output/format-data';
import { StringData } from '../../../../../_model/_output/_string/string-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-responsibilities',
  templateUrl: './responsibilities.component.html',
  styleUrls: ['./responsibilities.component.scss']
})
export class ResponsibilitiesComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public stringData: StringData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;
  @Input() public totalLength = 0;

  @Output() public changed = new EventEmitter();

  public submitted = false;

  public get Length() {
    return this.stringData.responsibility.length;
  }

  public get Valid(): boolean {
    return this.submitted && this.isFieldValid('responsibilities');
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public isFieldValid(name: string): boolean {
    if (this.canShowTotalLength(name)) {
      return this.totalLength <= this.getMaxTotalLength(name);
    } else {
      const maxLenght = this.getMaxLength(name);
      return maxLenght ? this.getLength() <= maxLenght : true;
    }
  }

  public ngOnInit(): void {
  }

  public canShowTotalLength(name: string): boolean {
    const totalLength = this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
    return totalLength ? true : false;
  }

  public getLength(): number {
    return this.stringData.responsibility === null ? 0 : this.stringData.responsibility.length;
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getMaxTotalLength(name: string): number {
    return this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
  }


  public onResponsibilitiesChanging($event: any): void {
    // const maxLength = this.getMaxLength('responsibilities');
    // if (maxLength <= this.advString.responsibility.length) {
    //   $event.preventDefault();
    // }
  }

  public onResponsibilitiesChanged() {
    this.changed.emit();
  }
}
