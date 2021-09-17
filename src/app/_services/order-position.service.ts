import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { OrderPositionInfo } from '../_model/_input/order-position-info';
import { OrderPositionData } from '../_model/_output/order-position-data';

@Injectable({ providedIn: 'root' })
export class OrderPositionService {
  constructor(private http: HttpClient) { }

  public getBasket(): Observable<OrderPositionInfo[]> {
    return this.http.get(`${environment.apiUrl}/order-positions/basket`)
      .pipe(
        map((response: { [key: number]: any }) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              cost: response[key].clientCost,
              sum: response[key].clientSum
            }));
        }));
  }

  public get(positionId: number): Observable<OrderPositionData> {
    return this.http.get(`${environment.apiUrl}/order-positions/item/${positionId}`)
      .pipe(
        map(response => {
          return response as OrderPositionData;
        })
      );
  }

  public create(orderPosition: OrderPositionData): Observable<number> {
    console.log(orderPosition);

    return this.http.post<number>(`${environment.apiUrl}/order-positions/item/create`, orderPosition)
      .pipe(
        map(response => response)
      );
  }

  public update(orderPositions: OrderPositionData): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/order-positions/item/update`, orderPositions)
      .pipe(
        map(response => response)
      );
  }

  public delete(orderPositionIds: number[]): Observable<any> {
    const pairs = orderPositionIds.map((value) => 'id=' + encodeURIComponent(value));
    const query = pairs.join('&');

    return this.http.delete(`${environment.apiUrl}/order-positions/item/delete/${query}`)
      .pipe(
        map(response => response)
      );
  }
}
