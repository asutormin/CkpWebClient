import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {AuthUser} from '../../_model/auth-user';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  public CurrentUser: AuthUser;
  public showLoginChangingFields: boolean;
  public showPasswordChangingFields: boolean;

  public get CurrentYear(): number {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(cu => this.CurrentUser = cu);
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public onShowLoginChangingFields(): void {
    this.showLoginChangingFields = !this.showLoginChangingFields;
  }

  public onLoginChangingApply(): void {
    const newLogin = (document.getElementById('newLogin') as HTMLInputElement).value;
    this.authService.setLogin(newLogin).subscribe(
      () => {
        this.showLoginChangingFields = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  public onShowPasswordChangingFields(): void {
    this.showPasswordChangingFields = !this.showPasswordChangingFields;
  }

  public onPasswordChangingApply(): void {
    const newPassword = (document.getElementById('newPassword2') as HTMLInputElement).value;
    this.authService.setPassword(newPassword).subscribe(
      () => this.onShowPasswordChangingFields(),
      error => {
        console.log(error);
      }
    );
  }


}
