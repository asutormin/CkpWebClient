import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AdvertisementsService} from '../../_services/advertisements.service';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private pSub: Subscription;

  public readOnly: boolean;
  public positions = [];

  constructor(
    private authService: AuthService,
    private advertisementsService: AdvertisementsService
  ) { }

  ngOnInit() {
    this.readOnly = true;

    this.authService.currentUser.subscribe(cu => {
      this.pSub = this.advertisementsService.getShoppingCart(cu.clientLegalPersonId).subscribe(positions => {
        this.positions = positions;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }
}
