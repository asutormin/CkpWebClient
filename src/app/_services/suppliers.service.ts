import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Company} from '../_model/company';
import {Rubric} from '../_model/rubric';
import {FormatType} from '../_model/format-type';
import {Tariff} from '../_model/tariff';
import {Graphic} from '../_model/graphic';
import {Experience} from '../_model/experience';
import {Education} from '../_model/education';
import {Currency} from '../_model/currency';
import {WorkGraphic} from '../_model/work-graphic';
import {Occurrence} from '../_model/occurrence';

@Injectable({providedIn: 'root'})
export class SuppliersService {
  constructor(private  http: HttpClient) {
  }

  public getSuppliers(): Observable<Company[]> {
    return this.http.get(`${environment.apiUrl}/suppliers`)
      .pipe(map(response => response as Company[]));
  }

  public getSupplier(supplierId: number): Observable<Company> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}`)
      .pipe(map(response => response as Company));
  }

  public getRubrics(priceId: number): Observable<Rubric[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/price/${priceId}/rubrics`)
      .pipe(map((response: {[key: number]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            version: new Date(response[key].version)
          }));
      }));
  }

  public getRubricVersion(rubricId: number, rubricVersion: Date): Observable<Rubric> {
    const isoRubricVersion = this.getIsoDate(rubricVersion);
    return this.http.get(`${environment.apiUrl}/suppliers/rubrics/${rubricId}/${isoRubricVersion}`)
      .pipe(map((response: any)  => {
          return {
            ...response,
            version: new Date(response.version)
          };
        }));
  }

  public getFormatTypes(supplierId: number): Observable<FormatType[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/formattypes`)
      .pipe(map(response => response as FormatType[]));
  }

  public getFormatType(formatTypeId: number): Observable<FormatType> {
    return this.http.get(`${environment.apiUrl}/suppliers/formatTypes/${formatTypeId}`)
      .pipe(map(response => response as FormatType));
  }

  public getTariffs(supplierId: number, formatTypeId: number): Observable<Tariff[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/tariffs/${formatTypeId}`)
      .pipe(map((response: {[key: number]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            format: Object.assign({}, response[key].format, { version: new Date(response[key].format.version) }),
          }));
      }));
  }

  public getTariffVersion(formatId: number, formatVersion: Date, priceId: number): Observable<Tariff> {
    const isoFormatVersion = this.getIsoDate(formatVersion);
    return this.http.get(`${environment.apiUrl}/suppliers/tariffs/${formatId}/${isoFormatVersion}/${priceId}`)
      .pipe(map((response: any) => {
        return {
          ...response,
          format: Object.assign({}, response.format, { version: new Date(response.format.version) })
        };
      }));
  }

  public getGraphics(supplierId: number, formatTypeId: number): Observable<Graphic[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/graphics/${formatTypeId}`)
      .pipe(map((response: {[key: number]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
              outDate: new Date(response[key].outDate)
          }));
      }));
  }

  public getGraphic(graphicId: number): Observable<Graphic> {
    return this.http.get(`${environment.apiUrl}/suppliers/graphics/${graphicId}`)
      .pipe(map((response: any) => {
        return {
          ...response,
          outDate: new Date(response.outDate)
        };
      }));
  }

  public getEducationsHandbook(supplierId: number, formatTypeId: number): Observable<Education[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/handbooks/${formatTypeId}/educations`)
      .pipe(map(response => response as Education[]));
  }

  public getExperiencesHandbook(supplierId: number, formatTypeId: number): Observable<Experience[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/handbooks/${formatTypeId}/experiences`)
      .pipe(map(response => response as Experience[]));
  }

  public getCurrenciesHandbook(supplierId: number, formatTypeId: number): Observable<Currency[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/handbooks/${formatTypeId}/currencies`)
      .pipe(map(response => response as Currency[]));
  }

  public getWorkGraphicsHandbook(supplierId: number, formatTypeId: number): Observable<WorkGraphic[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/handbooks/${formatTypeId}/workgraphics`)
      .pipe(map(response => response as WorkGraphic[]));
  }

  public getOccurrenciesHandbook(supplierId: number, formatTypeId: number): Observable<Occurrence[]> {
    return this.http.get(`${environment.apiUrl}/suppliers/${supplierId}/handbooks/${formatTypeId}/occurrencies`)
      .pipe(map(response => response as Occurrence[]));
  }

  private getIsoDate(dateToConvert): any {
    const date = new Date(dateToConvert);
    const isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

    return isoDate;
  }
}
