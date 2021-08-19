import { Component, Input, OnInit } from '@angular/core';
import { OrderPositionInfo } from '../../../_model/_input/order-position-info';
import { AccountService } from '../../../_services/account.service';
import { Router } from '@angular/router';
import { OrderPositionService } from '../../../_services/order-position.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {
  @Input() public positions: OrderPositionInfo[];
  @Input() public readOnly: false;
  @Input() public nds: number;

  public accountInCreation = false;

  public get totalSum() {
    return this.positions === undefined ? 0 : this.positions.reduce((sum, current) => sum + current.sum, 0);
  }

  public get totalNds() {
    return this.positions === undefined || this.nds === undefined
      ? 0
      : this.positions.reduce((sum, current) => sum + current.sum, 0) * (1 - 100 / (100 + this.nds));
  }

  public get CanAction() {
    return this.positions.filter(p => p.isChecked).length > 0;
  }

  constructor(
    private router: Router,
    private accountsService: AccountService,
    private advertisementsService: OrderPositionService
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
    this.advertisementsService.delete(positionIds).subscribe(
      () => this.positions = this.positions.filter(p => positionIds.indexOf(p.id) <= -1)
    );
  }

  private getSelectedPositions(): number[] {
    return this.positions.filter(p => p.isChecked).map(({ id }) => id);
  }

  public onPositionEdit(positionId: number): void {
    this.router.navigate([`/order-positions/item/${positionId}`]);
  }

  public onPositionRemove(id: number): void {
    this.advertisementsService.delete([id]).subscribe(
      () => this.positions = this.positions.filter(p => p.id !== id)
    );
  }
}
