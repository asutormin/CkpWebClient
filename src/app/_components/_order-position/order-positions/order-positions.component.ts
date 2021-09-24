import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderPositionInfo } from '../../../_model/_input/order-position-info';
import { AccountService } from '../../../_services/account.service';
import { Router } from '@angular/router';
import { OrderPositionService } from '../../../_services/order-position.service';
import { SharedService } from 'src/app/_services/shared.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';
import { AccountSettingsService } from 'src/app/_services/account-settings.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit, OnDestroy {
  private aSub: Subscription;
  private sSub: Subscription;
  private pSub: Subscription;
  private dSub: Subscription;

  @Input() public orderPositions: OrderPositionInfo[];
  @Input() public readOnly: false;
  @Input() public nds: number;

  public isWorking = false;
  public accountInCreation = false;
  public paymentInAction = false;
  public removingInAction = false;
  public insufficientFunds = false;
  public checkAll: boolean | null;

  public get totalSum() {
    return this.orderPositions
      ? this.orderPositions.reduce((sum, current) => sum + current.sum, 0)
      : 0;
  }

  public get totalNds() {
    return this.orderPositions && this.nds
      ? this.orderPositions.reduce((sum, current) => sum + current.sum * current.nds / 100, 0)
      : 0;
  }

  public get CanAction() {
    return this.getSelectedPositions().length > 0;
  }

  public get checkAllEnabled() {
    const businessUnitIds = this.orderPositions
      .map(p => p.price.businessUnitId);
    const uniqueBusinessUnits = [...new Set(businessUnitIds)];
    return uniqueBusinessUnits.length < 2 && this.orderPositions.length > 0;
  }

  constructor(
    private router: Router,
    private accountsService: AccountService,
    private accountSettingsService: AccountSettingsService,
    private orderPositionService: OrderPositionService,
    private paymentService: PaymentService,
    private sharedService: SharedService
  ) { }


  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
    if (this.sSub) {
      this.sSub.unsubscribe();
    }
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

  public onCheckAllChanged(): void {
    this.orderPositions.forEach(p => p.isChecked = this.checkAll);
  }

  public onPositionCheckChanged(): void {
    if (this.orderPositions.every(p => p.isChecked)) {
      this.checkAll = true;
    } else if (this.orderPositions.every(p => !p.isChecked)) {
      this.checkAll = false;
    } else {
      this.checkAll = null;
    }
  }

  public onCreateAccount(): void {

    const createAccount = () => {
      const positionIds = this.getSelectedPositionIds();
      this.isWorking = true;
      this.accountInCreation = true;
      this.aSub = this.accountsService.create(positionIds).subscribe(accountId => {
        this.accountInCreation = false;
        this.paymentInAction = true;
        this.pSub = this.paymentService.payAdvanceOrders().subscribe(p => this.router.navigate([`/accounts/item/${accountId}`]));
      });
    }

    this.sSub = this.accountSettingsService.getIsNeedPrepayment().subscribe(isNeedPrepayment => {
      if (isNeedPrepayment) {
        this.pSub = this.paymentService.getBalances().subscribe(balances => {
          const positions = this.getSelectedPositions();
          const sum = positions.reduce((sum, current) => sum + current.sum, 0);
          const businessUnitId = positions[0].price.businessUnitId;
          const balance = balances.filter(b => b.businessUnitId === businessUnitId)[0];
          if (balance.balanceSum < sum) {
            this.insufficientFunds = true;
          } else {
            createAccount();
          }
        })
      } else {
        createAccount();
      }
    })
  }

  public onRemoveSelectedPositions(): void {
    const positionIds = this.getSelectedPositionIds();
    this.removingInAction = true;
    this.dSub = this.orderPositionService.delete(positionIds).subscribe(() => {
      this.orderPositions = this.orderPositions.filter(p => positionIds.indexOf(p.id) <= -1);
      this.removingInAction = false;
    }
    );
  }

  public onPositionCreateBy(positionId: number): void {
    this.sharedService.OrderPositionId = positionId;
    this.router.navigate([`/order-positions/item/new`]);
  }

  public onPositionEdit(positionId: number): void {
    this.router.navigate([`/order-positions/item/${positionId}`]);
  }

  public onPositionRemove(id: number): void {
    this.removingInAction = true;
    this.orderPositionService.delete([id]).subscribe(() => {
      this.orderPositions = this.orderPositions.filter(p => p.id !== id)
      this.removingInAction = false;
    }
    );
  }

  public isPositionEnabled(businessUnitId: number): boolean {
    const selectedPositions = this.getSelectedPositions();
    return selectedPositions.length === 0 || selectedPositions.findIndex(p => p.price.businessUnitId === businessUnitId) > -1;
  }

  private getSelectedPositionIds(): number[] {
    return this.getSelectedPositions().map(({ id }) => id);
  }

  private getSelectedPositions(): OrderPositionInfo[] {
    return this.orderPositions.filter(p => p.isChecked);
  }
}
