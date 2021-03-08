import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StringConfigService} from '../../../../../_services/string-config.service';
import {AdvFormat} from '../../../../../_model/advertisement/adv-format';
import {AdvString} from '../../../../../_model/advertisement/string/adv-string';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-responsibilities',
  templateUrl: './responsibilities.component.html',
  styleUrls: ['./responsibilities.component.scss']
})
export class ResponsibilitiesComponent implements OnInit {

  @ViewChild('f', { static: false }) private form: NgForm;

  @Input() public advString: AdvString;
  @Input() public advSupplierId: number;
  @Input() public advFormat: AdvFormat;

  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.form.valid;
  }

  constructor(
    private stringConfigService: StringConfigService
  ) { }

  public ngOnInit(): void {
  }

  public getLength(): number {
    return this.advString.responsibility === null ? 0 : this.advString.responsibility.length;
  }

  public getMaxLength(name: string): any {
    return this.stringConfigService.getLength(this.advSupplierId, this.advFormat.id, name);
  }

  public onResponsibilitiesChanging($event: any): void {
    // const maxLength = this.getMaxLength('responsibilities');
    // if (maxLength <= this.advString.responsibility.length) {
    //   $event.preventDefault();
    // }
  }
}
