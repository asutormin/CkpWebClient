import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { GraphicInfo } from "../_model/_input/graphic-info";

@Injectable({ providedIn: 'root' })
export class GraphicApiService {
  constructor(
      private http: HttpClient) {
  }

  public getGraphics(supplierId: number, formatTypeId: number): Observable<GraphicInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/graphics/${formatTypeId}`)
      .pipe(map((response: { [key: number]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            outDate: new Date(response[key].outDate)
          }));
      }));
  }

  public getGraphic(graphicId: number): Observable<GraphicInfo> {
    return this.http.get(`${environment.apiUrl}/suppliers/graphics/${graphicId}`)
      .pipe(map((response: any) => {
        return {
          ...response,
          outDate: new Date(response.outDate)
        };
      }));
  }
}