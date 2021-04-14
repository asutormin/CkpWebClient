import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Education} from '../../../../../_model/education';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {NgForm} from '@angular/forms';
import {AdvRequirements} from '../../../../../_model/advertisement/string/requirements/adv-requirements';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) private form: NgForm;
  private edSub: Subscription;

  @Input() public advRequirements: AdvRequirements;
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public educations: Education[];
  public currentEducation: Education;
  public undefinedEducation: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private suppliersService: SuppliersService
  ) { }

  public ngOnInit(): void {
    this.edSub = this.suppliersService.getEducationsHandbook(this.advSupplierId, this.advFormat.formatTypeId)
      .subscribe(educations => {
        this.educations = educations;
        this.currentEducation = educations.find(ed => ed.id === this.advRequirements.educationId);
      });
  }

  public ngOnDestroy(): void {
    if (this.edSub) {
      this.edSub.unsubscribe();
    }
  }

  public onEducationChanged($event: any): void {
    this.advRequirements.educationId = this.currentEducation.id;
  }

}
