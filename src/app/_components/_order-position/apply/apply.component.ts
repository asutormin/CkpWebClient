import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  @Input() public newOrderPositionData: boolean;
  @Output() public submit = new EventEmitter();

  public submitted = false;
  public valid = true;

  constructor() { }

  public ngOnInit(): void {
  }

  public onClicked() {
    this.submit.emit();
    this.submitted = true;
  }
}
