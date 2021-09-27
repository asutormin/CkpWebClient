import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AddressInfo } from "../_model/_input/address-info";
import { StringInfo } from "../_model/_input/string-info";

@Injectable({ providedIn: 'root' })
export class StringService {
  constructor(private http: HttpClient) { }
  
  public getAddreses(description: string): Observable<AddressInfo[]> {
    return this.http.get(`${environment.apiUrl}/strings/addresses/list`, { params: { description: description } })
      .pipe(
        map(response => response as AddressInfo[]),
        debounceTime(1000),
        distinctUntilChanged()
      );
  }

  public getString(orderPositionId: number): Observable<StringInfo> {
    return this.http.get(`${environment.apiUrl}/strings/item/${orderPositionId}`)
    .pipe(
      map(response => response as StringInfo)
    );
  }
}
