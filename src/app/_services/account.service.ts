import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccountInfoLight, AccountInfo } from '../_model/_input/account-info';


@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) { }

  public getList(startAccountId: number, quantity: number): Observable<AccountInfoLight[]> {
    return this.http.get(`${environment.apiUrl}/accounts/list/${startAccountId}/${quantity}`)
      .pipe(
        map((response: { [key: number]: any }) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              supplier: response[key].supplierLegalPerson,
              paid: response[key].sum - response[key].debt
            }));
        }));
  }

  public get(accountId: number): Observable<AccountInfo> {
    return this.http.get(`${environment.apiUrl}/accounts/item/${accountId}`)
      .pipe(
        map((response: any) => {
           return {
            ...response,
            paid: response.sum - response.debt,
            client: response.clientLegalPerson,
            supplier: response.supplierLegalPerson,
            bank: response.bank,
            accountPositions: response.accountPositions,
            orderPositions: response.orderPositions.map((pos: any) => {
              return {
                ...pos,
                sum: pos.clientSum,
                cost: pos.clientCost
              };
            })
          };
        }));
  }

  public create(orderPositionIds: number[]): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}/accounts/item/create`, orderPositionIds)
      .pipe(
        map(response => response)
      );
  }

  public download(accountId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/accounts/doc/${accountId}`, { responseType: 'blob' });
  }
}
