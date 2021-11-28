import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderPositionInfo } from '../../../_model/_input/order-position-info';
import { AccountService } from '../../../_services/account.service';
import { Router } from '@angular/router';
import { OrderPositionService } from '../../../_services/order-position.service';
import { SharedService } from 'src/app/_services/shared.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { Subject, Subscription } from 'rxjs';
import { AccountSettingsService } from 'src/app/_services/account-settings.service';
import { ModuleService } from 'src/app/_services/module.service';
import { StringService } from 'src/app/_services/string.service';

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
  private imSub: Subscription[] = new Array();
  private orderPositions: OrderPositionInfo[];
  private orderPositionsBehaviorSubject = new Subject<OrderPositionInfo[]>();

  @Input() public set OrderPositions(value: OrderPositionInfo[]) {
    this.orderPositions = value;
    this.orderPositionsBehaviorSubject.next(value)
  }

  public get OrderPositions(): OrderPositionInfo[] {
    return this.orderPositions;
  }

  @Input() public readOnly: false;
  @Input() public nds: number;

  public isWorking = false;
  public accountInCreation = false;
  public paymentInAction = false;
  public removingInAction = false;
  public insufficientFunds = false;
  public checkAll: boolean | null;
  public currentOrderPosition: OrderPositionInfo;

  public get TotalSum() {
    return this.OrderPositions
      ? this.OrderPositions.reduce((sum, current) => sum + current.sum, 0)
      : 0;
  }

  public get TotalNds() {
    return this.OrderPositions && this.nds
      ? this.OrderPositions.reduce((sum, current) => sum + current.sum * current.nds / 100, 0)
      : 0;
  }

  public get CanAction() {
    return this.getSelectedPositions().length > 0;
  }

  public get CheckAllEnabled() {
    const businessUnitIds = this.OrderPositions
      .map(p => p.price.businessUnitId);
    const uniqueBusinessUnits = businessUnitIds.filter((v, i, a) => a.indexOf(v) === i);

    const orderIds = this.OrderPositions
      .map(p => p.orderId);
    const uniqueOrderIds = orderIds.filter((v, i, a) => a.indexOf(v) === i);

    return this.OrderPositions.length > 0 && (uniqueBusinessUnits.length < 2 || uniqueOrderIds.length < 2);
  }

  constructor(
    private router: Router,
    private accountsService: AccountService,
    private accountSettingsService: AccountSettingsService,
    private orderPositionService: OrderPositionService,
    private paymentService: PaymentService,
    private moduleService: ModuleService,
    private stringService: StringService,
    private sharedService: SharedService
  ) { 
    const loadIms = (orderPositions: OrderPositionInfo[]) => {
      orderPositions.forEach(op => {
        if (op.format.type.id == 1) {
          const sub = this.stringService.getString(op.id).subscribe(s => op.string = s);
          this.imSub.push(sub);
        } else if (op.format.type.id == 2) {
          const sub = this.moduleService.getSample(op.id).subscribe(m => op.module = m);
          this.imSub.push(sub);
        } else if (op.format.type.id == 26) {
          loadIms(op.childs);
        }
      })
    }

    this.orderPositionsBehaviorSubject.subscribe(() => loadIms(this.OrderPositions));
  }


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

    if (this.imSub) {
      this.imSub.forEach(sub => sub.unsubscribe())
    }
  }

  public onCheckAllChanged(): void {
    this.OrderPositions.forEach(p => p.isChecked = this.checkAll);
  }

  public onPositionCheckChanged(): void {
    if (this.OrderPositions.every(p => p.isChecked)) {
      this.checkAll = true;
    } else if (this.OrderPositions.every(p => !p.isChecked)) {
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
      this.OrderPositions = this.OrderPositions.filter(p => positionIds.indexOf(p.id) <= -1);
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
      this.OrderPositions = this.OrderPositions.filter(p => p.id !== id)
      this.removingInAction = false;
    });
  }

  public isPositionEnabled(orderId: number, businessUnitId: number): boolean {
    const selectedPositions = this.getSelectedPositions();
    return selectedPositions.length === 0 ||
      selectedPositions.map(sp => sp.orderId).filter((v, i, a) => a.indexOf(v) === i).indexOf(orderId) >= 0 ||
      selectedPositions.findIndex(p => p.price.businessUnitId === businessUnitId) > -1;
  }
 
  public onShowPreview(orderPosition: OrderPositionInfo): void {
    this.currentOrderPosition = orderPosition;
  }

  public onNextPreview(): void {
    let index = this.OrderPositions.indexOf(this.currentOrderPosition);
    if (index < this.OrderPositions.length - 1) {
      index++;
      this.currentOrderPosition = this.OrderPositions[index];
    }
  }

  public onPrevPreview(): void {
    let index = this.OrderPositions.indexOf(this.currentOrderPosition);
    if (index > 0) {
      index--;
      this.currentOrderPosition = this.OrderPositions[index];
    }
  }

  private getSelectedPositionIds(): number[] {
    return this.getSelectedPositions().map(({ id }) => id);
  }

  private getSelectedPositions(): OrderPositionInfo[] {
    return this.OrderPositions.filter(p => p.isChecked);
  }
}


