import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AccountInfoLight } from "../_model/_input/account-info";
import { AddressInfo } from "../_model/_input/address-info";

@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private http: HttpClient) { }

  
  public getList(description: string): Observable<AddressInfo[]> {
    return this.http.get(`${environment.apiUrl}/addresses/list`, { params: { description: description } })
      .pipe(
        map(response => response as AddressInfo[]),
        debounceTime(1000),
        distinctUntilChanged()
      );
  }
}
