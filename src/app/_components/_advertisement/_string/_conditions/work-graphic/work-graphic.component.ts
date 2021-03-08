import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WorkGraphic} from '../../../../../_model/work-graphic';
import {AdvWorkGraphic} from '../../../../../_model/advertisement/string/conditions/adv-work-graphic';
import {Subscription} from 'rxjs';
import {SuppliersService} from '../../../../../_services/suppliers.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-work-graphic',
  templateUrl: './work-graphic.component.html',
  styleUrls: ['./work-graphic.component.scss']
})
export class WorkGraphicComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) private form: NgForm;

  private wSub: Subscription;

  @Input() public advWorkGraphic: AdvWorkGraphic;
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public workGraphics: WorkGraphic[];
  public currentWorkGraphic: WorkGraphic;
  public undefinedWorkGraphic: any;
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private suppliersService: SuppliersService
  ) { }

  public ngOnInit(): void {
    this.wSub = this.suppliersService.getWorkGraphicsHandbook(this.advSupplierId, this.advFormat.formatTypeId)
      .subscribe(workGraphics => {
        this.workGraphics = workGraphics;
        this.currentWorkGraphic = workGraphics.find(wg => wg.id === this.advWorkGraphic.id);
      });
  }

  public ngOnDestroy(): void {
    if (this.wSub) {
      this.wSub.unsubscribe();
    }
  }

  public onWorkGraphicChanged(): void {
    this.advWorkGraphic.id = this.currentWorkGraphic.id;
  }
}
