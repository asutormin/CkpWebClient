import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ImageInfo } from '../_model/_input/image-info';
import { ModuleParamsStandard } from '../_model/_output/_module/module-params-standard';

@Injectable({ providedIn: 'root' })
export class ModuleService {
  constructor(
    private http: HttpClient) {
  }

  public createSample(module: File): Observable<ImageInfo> {
    const formData = new FormData();
    formData.append('module', module, module.name);

    return this.http.post<ImageInfo>(`${environment.apiUrl}/modules/create/sample`, formData)
      .pipe(
        map(response => response as ImageInfo)
      );
  }

  public saveModule(module: File): Observable<string> {
    const formData = new FormData();
    formData.append('module', module);

    return this.http.post<string>(`${environment.apiUrl}/modules/save`, formData, { responseType: 'text' as 'json' })
      .pipe(
        map(response => response as string)
      );
  }

  public deleteModule(fileId: string): Observable<void> {
    console.log(fileId);
    // { headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}
    return this.http.post<void>(`${environment.apiUrl}/modules/delete/${fileId}`, null);
  }

  public buildSampleStandard(params: ModuleParamsStandard): Observable<ImageInfo> {
    return this.http.post<ImageInfo>(`${environment.apiUrl}/modules/build/sample/standard`, params)
      .pipe(
        map(response => {
          console.log(response);
          return response as ImageInfo;
        })
      );
  }

  public getSample(orderPositionId: number): Observable<ImageInfo> {
    return this.http.get(`${environment.apiUrl}/modules/sample/${orderPositionId}`)
    .pipe(
        map(response => response as ImageInfo)
    )
  }
}
