import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StringInfo } from 'src/app/_model/_input/string-info';

@Component({
  selector: 'app-preview-string',
  templateUrl: './preview-string.component.html',
  styleUrls: ['./preview-string.component.scss']
})
export class PreviewStringComponent implements OnInit {
  @Input() public string: StringInfo;
  @Input() public fontColor: string;

  constructor() {}

  ngOnInit(): void {
  }

}
