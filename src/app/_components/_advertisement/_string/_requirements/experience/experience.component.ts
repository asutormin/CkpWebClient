import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Experience} from '../../../../../_model/experience';
import {AdvExperience} from '../../../../../_model/advertisement/string/requirements/adv-experience';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {

  @ViewChild('f') private form: NgForm;
  private exSub: Subscription;

  @Input() public advExperience: AdvExperience;
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public experiences: Experience[];
  public currentExperience: Experience;
  public undefinedExperience: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private suppliersService: SuppliersService
  ) { }

  public ngOnInit(): void {
    this.exSub = this.suppliersService.getExperiencesHandbook(this.advSupplierId, this.advFormat.formatTypeId)
      .subscribe(experiences => {
        this.experiences = experiences;
        this.currentExperience = experiences.find(ex => ex.id === this.advExperience.id);
      });
  }

  public ngOnDestroy(): void {
    if (this.exSub) {
      this.exSub.unsubscribe();
    }
  }

  public onExperienceChanged(): void {
    this.advExperience.id = this.currentExperience.id;
  }

}
