import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Advertisement} from '../_model/advertisement/advertisement';
import {Position} from '../_model/position';

@Injectable({providedIn: 'root'})
export class AdvertisementsService {
  constructor(private  http: HttpClient ) {  }

  public getShoppingCart(legalPersonId: number): Observable<Position[]> {
    return this.http.get(`${environment.apiUrl}/advertisements/shoppingCart/${legalPersonId}`)
      .pipe(
        map((response: {[key: number]: any}) => {
            return Object
              .keys(response)
              .map(key => ({
                ...response[key],
                price: response[key].clientPrice,
                sum: response[key].clientSum
              }));
        }));
  }

  public getAdvertisement(positionId: number): Observable<Advertisement> {
    return this.http.get(`${environment.apiUrl}/advertisements/${positionId}`)
      .pipe(
        map(response => {
          return response as Advertisement;
        })
      );
  }

  public createAdvertisement(advertisement: Advertisement): Observable<number> {
    console.log(advertisement);

    return this.http.post<number>(`${environment.apiUrl}/advertisements/create`, advertisement)
      .pipe(
        map(response => response)
      );
  }

  public updateAdvertisement(advertisement: Advertisement): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/advertisements/update`, advertisement)
      .pipe(
        map(response => response)
      );
  }

  public deleteAdvertisements(advertisementIds: number[]): Observable<any> {
    const pairs = advertisementIds.map( (value) => 'id=' + encodeURIComponent(value));
    const query = pairs.join('&');

    return this.http.delete(`${environment.apiUrl}/advertisements/delete/${query}`)
      .pipe(
        map(response => response)
      );
  }
}
