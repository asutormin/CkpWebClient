import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../../_model/position';
import {AccountsService} from '../../../_services/accounts.service';
import {Router} from '@angular/router';
import {AdvertisementsService} from '../../../_services/advertisements.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {
  @Input() public positions: Position[];
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
    private accountsService: AccountsService,
    private advertisementsService: AdvertisementsService
  ) { }

  public ngOnInit(): void {
  }

  public onCreateAccount(): void {
    const positionIds = this.getSelectedPositions();
    this.accountInCreation = true;
    this.accountsService.createAccount(positionIds).subscribe(accountId =>
      this.router.navigate([`/accounts/${accountId}`])
    );
  }

  public onRemoveSelectedPositions(): void {
    const positionIds = this.getSelectedPositions();
    this.advertisementsService.deleteAdvertisements(positionIds).subscribe(
      () => this.positions = this.positions.filter(p => positionIds.indexOf(p.id) <= -1)
    );
  }

  private getSelectedPositions(): number[] {
    return  this.positions.filter(p => p.isChecked).map(({ id }) => id);
  }

  public onPositionEdit(positionId: number): void {
    this.router.navigate([`/publication/${positionId}`]);
  }

  public onPositionRemove(id: number): void {
    this.advertisementsService.deleteAdvertisements([ id ]).subscribe(
      () => this.positions = this.positions.filter(p => p.id !== id)
    );
  }
}
