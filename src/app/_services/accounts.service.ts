import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AccountLight, Account} from '../_model/account';


@Injectable({providedIn: 'root'})
export class AccountsService {
  constructor(private  http: HttpClient) {  }

  public getAccounts(clientLegalPersonId: number, startAccountId: number, quantity: number): Observable<AccountLight[]> {
    return this.http.get(`${environment.apiUrl}/accounts/${clientLegalPersonId}/${startAccountId}/${quantity}`)
      .pipe(
        map((response: {[key: number]: any}) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              supplier: response[key].supplierLegalPerson,
              paid: response[key].sum - response[key].debt
            }));
        }));
  }

  public getAccount(accountId: number): Observable<Account> {
    return this.http.get(`${environment.apiUrl}/accounts/${accountId}`)
      .pipe(
        map((responce: any) => {
          return {
            ...responce,
            paid: responce.sum - responce.debt,
            client: responce.clientLegalPerson,
            supplier: responce.supplierLegalPerson,
            bank: responce.bank,
            positions: responce.positions.map((pos: any) => {
              return {
                ...pos,
                sum: pos.clientSum,
                price: pos.clientPrice
              };
            })
          };
        }));
  }

  public createAccount(orderPositionIds: number[]): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}/advertisements/account/create`, orderPositionIds)
      .pipe(
        map(response => response)
      );
  }

  public downloadAccount(accountId: number): Observable<Blob>{
    return  this.http.get(`${environment.apiUrl}/accounts/document/${accountId}`, { responseType: 'blob' });
  }
}
