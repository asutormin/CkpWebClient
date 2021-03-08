import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../_services/auth.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public submitted = false;
  private returnUrl: string;

  public form: FormGroup;
  public message: string;

  public get F() { return this.form.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
      if (params.loginAgain) {
        this.message = 'Сессия истекла. Введите данные ещё раз.';
      } else if (params.authFailed) {
        this.message = 'Пожалуйста, введите данные.';
      }
    });

    this.form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.authService.login(this.F.login.value, this.F.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.submitted = false;
        },
        error => {
          console.log(error);
          this.submitted = false;
        });
  }
}
