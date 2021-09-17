import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../_services/account.service';
import { AccountInfoLight } from '../../../_model/_input/account-info';
import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {

  private aSub: Subscription;
  private itemsCount: number;

  public accountsToDisplay: AccountInfoLight[];
  public allAccountsLoaded: boolean;
  public sortDirection: number;
  public sortField: string;

  public get accountsCount() {
    return this.accountsToDisplay === undefined ? 0 : this.accountsToDisplay.length;
  }

  constructor(    
    private router: Router,
    public userService: UserService,
    private accountsService: AccountService
  ) {
    this.itemsCount = 10;
    this.accountsToDisplay = [];
  }

  public ngOnInit(): void {
    this.loadAccounts(0);
  }

  public ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  public getMoreItems(): void {
    const minAccountId = Math.min.apply(Math, this.accountsToDisplay.map(a => a.id));
    this.loadAccounts(minAccountId);
  }

  public onSort(fieldName: string): void {

    if (fieldName !== this.sortField) {
      this.sortDirection = 0;
    }

    this.sortField = fieldName;
    /* tslint:disable:no-string-literal */
    if (this.sortDirection === 0 || this.sortDirection === -1) {
      this.accountsToDisplay.sort((a, b) => a[fieldName] > b[fieldName] ? 1 : a[fieldName] < b[fieldName] ? -1 : 0);
      this.sortDirection = 1;
    } else if (this.sortDirection === 1) {
      this.accountsToDisplay.sort((a, b) => a[fieldName] < b[fieldName] ? 1 : a[fieldName] > b[fieldName] ? -1 : 0);
      this.sortDirection = -1;
    }
    /* tslint:enable:no-string-literal */
  }

  public onNavigate(accountId: number): void {
    this.router.navigate([`/accounts/item/${accountId}`]);
  }

  private loadAccounts(startAccountId: number): void {
    this.aSub = this.accountsService.getList(startAccountId, this.itemsCount).subscribe(
      accounts => {
        this.accountsToDisplay = this.accountsToDisplay.concat(accounts);
        if (accounts.length < this.itemsCount) {
          this.allAccountsLoaded = true;
        }
      });
  }
}
