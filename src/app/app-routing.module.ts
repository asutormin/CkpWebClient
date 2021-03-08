import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainLayoutComponent} from './_components/main-layout/main-layout.component';
import {PublicationComponent} from './_components/_advertisement/publication/publication.component';
import {AccountsComponent} from './_components/_accounting/accounts/accounts.component';
import {AccountComponent} from './_components/_accounting/account/account.component';
import {LoginComponent} from './_components/login/login.component';
import {HomeComponent} from './_components/home/home.component';
import {ShoppingCartComponent} from './_components/shopping-cart/shopping-cart.component';
import {AuthGuard} from './_helpers/auth.guard';


const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  /*
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  */
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard]},
      {path: 'publication', component: PublicationComponent, canActivate: [AuthGuard]},
      {path: 'publication/:id', component: PublicationComponent, canActivate: [AuthGuard]},
      {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
      {path: 'accounts/:id', component: AccountComponent, canActivate: [AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
