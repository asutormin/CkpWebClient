import { Component, Input, OnInit } from '@angular/core';
import { OrderPositionInfo } from '../../../_model/_input/order-position-info';
import { AccountService } from '../../../_services/account.service';
import { Router } from '@angular/router';
import { OrderPositionService } from '../../../_services/order-position.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {
  @Input() public orderPositions: OrderPositionInfo[];
  @Input() public readOnly: false;
  @Input() public nds: number;

  public accountInCreation = false;

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
    return this.orderPositions.filter(p => p.isChecked).length > 0;
  }

  constructor(
    private router: Router,
    private accountsService: AccountService,
    private orderPositionService: OrderPositionService,
    private sharedService: SharedService
  ) { }

  public ngOnInit(): void {
  }

  public onCreateAccount(): void {
    const positionIds = this.getSelectedPositions();
    this.accountInCreation = true;
      this.accountsService.create(positionIds).subscribe(accountId =>
        this.router.navigate([`/accounts/item/${accountId}`])
      );
  }

  public onRemoveSelectedPositions(): void {
    const positionIds = this.getSelectedPositions();
    this.orderPositionService.delete(positionIds).subscribe(
      () => this.orderPositions = this.orderPositions.filter(p => positionIds.indexOf(p.id) <= -1)
    );
  }

  private getSelectedPositions(): number[] {
    return this.orderPositions.filter(p => p.isChecked).map(({ id }) => id);
  }

  public onPositionCreateBy(positionId: number): void {
    this.sharedService.OrderPositionId = positionId;
    this.router.navigate([`/order-positions/item/new`]);
  }

  public onPositionEdit(positionId: number): void {
    this.router.navigate([`/order-positions/item/${positionId}`]);
  }

  public onPositionRemove(id: number): void {
    this.orderPositionService.delete([id]).subscribe(
      () => this.orderPositions = this.orderPositions.filter(p => p.id !== id)
    );
  }
}
