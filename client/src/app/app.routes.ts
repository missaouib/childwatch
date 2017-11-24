import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {AuthenticationService} from './security/authentication.service';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'meals', pathMatch: 'full', canActivate: [AuthenticationService]},
  {
    path: '', component: PageLayoutComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'meals', loadChildren: './food/food.module#FoodModule', canActivate: [AuthenticationService]},
    ]
  },
  {
    path: '', component: AuthLayoutComponent,
    children: [
      {path: 'login', loadChildren: './login/login.module#LoginModule'}
    ]
  }
];