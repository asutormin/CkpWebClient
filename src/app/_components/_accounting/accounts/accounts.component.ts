import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AccountsService} from '../../../_services/accounts.service';
import {AccountLight} from '../../../_model/account';
import {AuthService} from '../../../_services/auth.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {

  private aSub: Subscription;
  private itemsCount: number;

  public accountsToDisplay: AccountLight[];
  public allAccountsLoaded: boolean;
  public sortDirection: number;
  public sortField: string;

  public get accountsCount() {
    return this.accountsToDisplay === undefined ? 0 : this.accountsToDisplay.length;
  }

  constructor(
    private authService: AuthService,
    private accountsService: AccountsService
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
    const minAccountId = Math.min.apply(Math, this.accountsToDisplay.map(a => a.id ));
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

  private loadAccounts(startAccountId: number): void {
    this.authService.currentUser.subscribe(cu => {
      const clientLegalPersonId = this.authService.currentUserValue.clientLegalPersonId;
      this.aSub = this.accountsService.getAccounts(clientLegalPersonId, startAccountId, this.itemsCount).subscribe(
        accounts => {
          this.accountsToDisplay = this.accountsToDisplay.concat(accounts);
          if (accounts.length < this.itemsCount) {
            this.allAccountsLoaded = true;
          }
        });
    });
  }
}
