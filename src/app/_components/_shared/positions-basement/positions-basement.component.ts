import { Component, Input, OnInit } from '@angular/core';
import { OrderPositionInfo } from 'src/app/_model/_input/order-position-info';

@Component({
  selector: 'app-positions-basement',
  templateUrl: './positions-basement.component.html',
  styleUrls: ['./positions-basement.component.scss']
})
export class PositionsBasementComponent implements OnInit {
  @Input() public orderPositions: OrderPositionInfo[];

  public get totalSum() {
    return this.orderPositions
      ? this.orderPositions.reduce((sum, current) => sum + current.sum, 0)
      : 0;
  }

  public get totalNds() {
    return this.orderPositions
      ? this.orderPositions.reduce((sum, current) => sum + current.sum * current.nds / 100, 0)
      : 0;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
