import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { SupplierInfo } from '../_model/_input/supplier-info';
import { RubricInfo } from '../_model/_input/rubric-info';
import { FormatTypeInfo } from '../_model/_input/format-type-info';
import { TariffInfo } from '../_model/_input/tariff-info';
import { GraphicInfo } from '../_model/_input/graphic-info';
import { ExperienceInfo } from '../_model/_input/experience-info';
import { EducationInfo } from '../_model/_input/education-info';
import { CurrencyInfo } from '../_model/_input/currency-info';
import { WorkGraphicInfo } from '../_model/_input/work-graphic-info';
import { OccurrenceInfo } from '../_model/_input/occurrence-info';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  constructor(private http: HttpClient) {
  }

  public getSuppliers(): Observable<SupplierInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers`)
      .pipe(map(response => response as SupplierInfo[]));
  }

  public getSupplier(supplierId: number): Observable<SupplierInfo> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}`)
      .pipe(map(response => response as SupplierInfo));
  }

  public getRubrics(priceId: number): Observable<RubricInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/price/${priceId}/rubrics`)
      .pipe(map((response: { [key: number]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            version: new Date(response[key].version)
          }));
      }));
  }

  public getRubricVersion(rubricId: number, rubricVersion: Date): Observable<RubricInfo> {
    const isoRubricVersion = this.getIsoDate(rubricVersion);
    return this.http.get(`${environment.apiUrl}/suppliers/rubrics/${rubricId}/${isoRubricVersion}`)
      .pipe(map((response: any) => {
        return {
          ...response,
          version: new Date(response.version)
        };
      }));
  }

  public getFormatTypes(supplierId: number): Observable<FormatTypeInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/formattypes`)
      .pipe(map(response => response as FormatTypeInfo[]));
  }

  public getFormatType(formatTypeId: number): Observable<FormatTypeInfo> {
    return this.http.get(`${environment.apiUrl}/suppliers/formatTypes/${formatTypeId}`)
      .pipe(map(response => response as FormatTypeInfo));
  }

  public getTariffs(supplierId: number, formatTypeId: number): Observable<TariffInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/tariffs/${formatTypeId}`)
      .pipe(map((response: { [key: number]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            format: Object.assign({}, response[key].format, { version: new Date(response[key].format.version) }),
          }));
      }));
  }

  public getTariffVersion(formatId: number, formatVersion: Date, priceId: number): Observable<TariffInfo> {
    const isoFormatVersion = this.getIsoDate(formatVersion);
    return this.http.get(`${environment.apiUrl}/suppliers/tariffs/${formatId}/${isoFormatVersion}/${priceId}`)
      .pipe(map((response: any) => {
        return {
          ...response,
          format: Object.assign({}, response.format, { version: new Date(response.format.version) })
        };
      }));
  }


  public getEducationsHandbook(): Observable<EducationInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/handbooks/educations`)
      .pipe(map(response => response as EducationInfo[]));
  }

  public getExperiencesHandbook(): Observable<ExperienceInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/handbooks/experiences`)
      .pipe(map(response => response as ExperienceInfo[]));
  }

  public getCurrenciesHandbook(): Observable<CurrencyInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/handbooks/currencies`)
      .pipe(map(response => response as CurrencyInfo[]));
  }

  public getWorkGraphicsHandbook(): Observable<WorkGraphicInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/handbooks/workgraphics`)
      .pipe(map(response => response as WorkGraphicInfo[]));
  }

  public getOccurrenciesHandbook(supplierId: number): Observable<OccurrenceInfo[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/handbooks/occurrencies/${supplierId}`)
      .pipe(map(response => response as OccurrenceInfo[]));
  }

  private getIsoDate(dateToConvert): any {
    const date = new Date(dateToConvert);
    const isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

    return isoDate;
  }
}
