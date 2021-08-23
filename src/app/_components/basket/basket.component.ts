import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderPositionService } from '../../_services/order-position.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {
  private pSub: Subscription;

  public readOnly: boolean;
  public orderPositions = [];

  constructor(
    private authService: UserService,
    private orderPositionService: OrderPositionService
  ) { }

  ngOnInit() {
    this.readOnly = true;
    this.pSub = this.orderPositionService.getBasket().subscribe(positions => {
      this.orderPositions = positions;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }
}
