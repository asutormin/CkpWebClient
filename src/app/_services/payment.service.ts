import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { BalanceInfo } from "../_model/_input/balance-info";

@Injectable({ providedIn: 'root' })
export class PaymentService {
  public balances$: Observable<BalanceInfo[]>;
  public balances: BalanceInfo[];

  constructor(private http: HttpClient) {
    // setInterval(() => {
    //   this.refreshBalances();
    //   console.log(this.balances)
    // }, 1000);
  }

  public refreshBalances(): void {
    this.getBalances().subscribe(
      balances => this.balances = balances);
  }

  public getBalances(): Observable<BalanceInfo[]> {
    return this.http.get(`${environment.apiUrl}/payments/balances/list`)
    .pipe(
      map(result => result as BalanceInfo[]));
  }

  public payAdvanceOrders(): Observable<any> {
    return this.http.put(`${environment.apiUrl}/payments/pay-advance-orders`, {})
    .pipe(
      map(result => result));
  }
}
