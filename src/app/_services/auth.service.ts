import {catchError, map } from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthUser} from '../_model/auth-user';
import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private jwtHelper = new JwtHelperService();
  private currentUserSubject: BehaviorSubject<AuthUser>;

  public currentUser: Observable<AuthUser>;
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AuthUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser {
    const currentUser = this.currentUserSubject.value;
    if (currentUser != null) {
      const token = currentUser.token;
      if (token != null) {
        const isTokenExpired = this.jwtHelper.isTokenExpired(currentUser.token);
        if (!isTokenExpired) {
          return this.currentUserSubject.value;
        }
      }
    }

    this.logout();
    return null;
  }

  public login(login: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, {login, password})
      .pipe(
        map(authUser => {
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          this.currentUserSubject.next(authUser);
          return authUser;
        }),
        catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.error$.next(message);

    return throwError(error);
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  public setLogin(newLogin: string) {
    console.log(newLogin);
    console.log(this.currentUserValue.login);
    console.log(`${environment.apiUrl}/auth/login/set/${this.currentUserValue.login}/${newLogin}`);
    return this.http.patch<any>(`${environment.apiUrl}/auth/login/set/${this.currentUserValue.login}/${newLogin}`, null)
      .pipe(map(authUser => {
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        console.log(authUser);
        return authUser;
      }));
  }

  public setPassword(newPassword: string) {
    console.log(this.currentUserValue.login);
    return this.http.patch<any>(`${environment.apiUrl}/auth/password/set/${this.currentUserValue.login}/${newPassword}`, null)
      .pipe(map(authUser => {
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        return authUser;
      }));
  }
}
