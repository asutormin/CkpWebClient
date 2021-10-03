import { Component, Input, OnInit } from '@angular/core';
import { OrderPositionInfo } from 'src/app/_model/_input/order-position-info';

@Component({
  selector: 'app-preview-package',
  templateUrl: './preview-package.component.html',
  styleUrls: ['./preview-package.component.scss']
})
export class PreviewPackageComponent implements OnInit {
  @Input() public orderPositions: OrderPositionInfo[];
  
  public slideOptions = { items: 1, dots: false, nav: true, autoplay: true, loop: true };  

  constructor() { }

  ngOnInit(): void {
  }

}
