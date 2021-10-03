import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, throttleTime } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { OrderPositionInfo } from "../_model/_input/order-position-info";

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) { }

  public getOrderPositions(value: string, skipCount: number): Observable<OrderPositionInfo[]> {
    console.log(skipCount);
    console.log(value);
      return this.http.get(`${environment.apiUrl}/search/list`, { params: { value: value, skipCount: skipCount } })
      .pipe(
        map((response: { [key: number]: any }) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              cost: response[key].clientCost,
              sum: response[key].clientSum
            }));
        })
        );
  }
}



