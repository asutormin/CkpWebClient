import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AccountSettingsService {
  
    constructor(
      private http: HttpClient) { }

    public getIsNeedPrepayment(): Observable<boolean> {
        return this.http.get(`${environment.apiUrl}/account-settings/is-need-prepayment`)
            .pipe(
                map(response => response as boolean ));
    }

    public getInteractionBusinessUnitId(): Observable<number> {
        return this.http.get(`${environment.apiUrl}/account-settings/interaction-business-unit-id`)
        .pipe(
            map(response => response as number ));
    }
}