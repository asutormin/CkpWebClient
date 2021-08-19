import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { Router } from '@angular/router';
import { AuthInfo } from '../../_model/_input/auth-info';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  public CurrentUser: AuthInfo;
  public showLoginChangingFields: boolean;
  public showPasswordChangingFields: boolean;

  public get CurrentYear(): number {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  constructor(
    private router: Router,
    private authService: UserService
  ) {
    this.authService.currentUser.subscribe(cu => this.CurrentUser = cu);
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
