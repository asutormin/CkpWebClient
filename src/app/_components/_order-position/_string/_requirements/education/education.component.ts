import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EducationInfo } from '../../../../../_model/_input/education-info';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../../../../_services/supplier.service';
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';
import { RequirementsData } from '../../../../../_model/_output/_string/_requirements/requirements-data';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;
  private edSub: Subscription;

  @Input() public requirementsData: RequirementsData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public educations: EducationInfo[];
  public currentEducation: EducationInfo;
  public undefinedEducation: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private supplierService: SupplierService
  ) { }

  public ngOnInit(): void {
    this.edSub = this.supplierService.getEducationsHandbook()
      .subscribe(educations => {
        this.educations = educations;
        this.currentEducation = educations.find(ed => ed.id === this.requirementsData.educationId);
      });
  }

  public ngOnDestroy(): void {
    if (this.edSub) {
      this.edSub.unsubscribe();
    }
  }

  public onEducationChanged($event: any): void {
    this.requirementsData.educationId = this.currentEducation.id;
  }

}
