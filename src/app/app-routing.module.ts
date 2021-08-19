import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './_components/main-layout/main-layout.component';
import { OrderPositionComponent } from './_components/_order-position/order-position/order-position.component';
import { AccountsComponent } from './_components/_accounting/accounts/accounts.component';
import { AccountComponent } from './_components/_accounting/account/account.component';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import { BasketComponent } from './_components/basket/basket.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: MainLayoutComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
      { path: 'order-positions/item/new', component: OrderPositionComponent, canActivate: [AuthGuard] },
      { path: 'order-positions/item/:id', component: OrderPositionComponent, canActivate: [AuthGuard] },
      { path: 'accounts/list', component: AccountsComponent, canActivate: [AuthGuard] },
      { path: 'accounts/item/:id', component: AccountComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
