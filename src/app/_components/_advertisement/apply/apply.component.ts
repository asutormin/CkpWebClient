import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Company} from '../../../_model/company';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  private submitted = false;

  @Input() public newAdvertisement: boolean;

  @Output() public submit = new EventEmitter();

  public valid = true;

  constructor() { }

  public ngOnInit(): void {
  }

  public onClicked() {
    this.submit.emit();
    this.submitted = true;
  }
}
