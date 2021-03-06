import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExperienceInfo } from '../../../../../_model/_input/experience-info';
import { ExperienceData } from '../../../../../_model/_output/_string/_requirements/experience-data';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../../../../_services/supplier.service'
import { FormatData } from '../../../../../_model/_output/format-data';
import { NgForm } from '@angular/forms';
import { number } from 'echarts';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;
  private exSub: Subscription;

  @Input() public experienceData: ExperienceData;
  @Input() public supplierId: number;
  @Input() public formatData: FormatData;

  public experiences: ExperienceInfo[];
  public currentExperience: ExperienceInfo;
  public undefinedExperience: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted;
  }

  constructor(
    private supplierService: SupplierService
  ) { }

  public ngOnInit(): void {
    this.exSub = this.supplierService.getExperiencesHandbook()
      .subscribe(experiences => {
        this.experiences = experiences;
        this.currentExperience = experiences.find(ex => ex.id === this.experienceData.id);
      });
  }

  public ngOnDestroy(): void {
    if (this.exSub) {
      this.exSub.unsubscribe();
    }
  }

  public onExperienceChanged(): void {
    this.experienceData.id = this.currentExperience
      ? this.currentExperience.id
      : this.undefinedExperience;
  }

  public onExperienceValueChanged($event: KeyboardEvent): void {
    if ($event.key == ',' || $event.key == '.') {
       $event.preventDefault();
    }
  }

}
