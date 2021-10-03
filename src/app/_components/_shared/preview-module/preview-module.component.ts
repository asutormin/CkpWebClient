import { Component, Input, OnInit } from '@angular/core';
import { ImageInfo } from 'src/app/_model/_input/image-info';

@Component({
  selector: 'app-preview-module',
  templateUrl: './preview-module.component.html',
  styleUrls: ['./preview-module.component.scss']
})
export class PreviewModuleComponent implements OnInit {
  @Input() public module: ImageInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
