import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StringConfigService } from '../../../../../_services/string-config.service';
import { RequirementsData } from '../../../../../_model/_output/_string/_requirements/requirements-data';
import { FormatData } from '../../../../../_model/_output/format-data';
import { ExperienceComponent } from '../experience/experience.component';
import { EducationComponent } from '../education/education.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {

  @ViewChild('f') private form: NgForm;
  @ViewChild('education') private educationComponent: EducationComponent;
  @ViewChild('experience') private experienceComponent: ExperienceComponent;

  private submitted = false;

  @Input() public requirementsData: RequirementsData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;
  @Input() public totalLength = 0;

  @Output() public changed = new EventEmitter();

  public get Length() {
    return this.requirementsData.value.length;
  }

  public set Submitted(value: boolean) {
    this.submitted = value;

    if (this.educationComponent !== undefined) {
      this.educationComponent.submitted = value;
    }

    if (this.experienceComponent !== undefined) {
      this.experienceComponent.submitted = value;
    }
  }

  public get Submitted() {
    return this.submitted;
  }

  public get Valid(): boolean {
    return this.submitted && this.isFieldValid('requirements');
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
  }

  public isFieldValid(name: string): boolean {
    if (this.canShowTotalLength(name)) {
      return this.totalLength <= this.getMaxTotalLength(name);
    } else {
      const maxLenght = this.getMaxLength(name);
      return maxLenght ? this.getLength() <= maxLenght : true;
    }
  }

  public canShowElement(name: string): boolean {
    return this.stringConfigService.getVisibility(this.supplierId, this.formatData.id, name);
  }

  public canShowTotalLength(name: string): boolean {
    const totalLength = this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
    return totalLength ? true : false;
  }

  public getLength(): number {
    return this.requirementsData.value === null ? 0 : this.requirementsData.value.length;
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.supplierId, this.formatData.id, name);
  }

  public getMaxTotalLength(name: string): number {
    return this.stringConfigService.getTotalLength(this.supplierId, this.formatData.id, name);
  }

  public onRequirementsValueChanging($event: any): void {
    // const maxLength = this.getMaxLength('requirements');
    // if (maxLength <= this.advRequirements.value.length) {
    //   $event.preventDefault();
    // }
  }

  public onRequirementsChanged() {
    this.changed.emit();
  }
}
