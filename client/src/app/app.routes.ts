import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {SettingsComponent} from './config/settings/settings.component';
import {AuthenticationService} from './security/authentication.service';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'meals', canActivate: [AuthenticationService], pathMatch: 'full'},
  {
    path: '', component: PageLayoutComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'meals', loadChildren: './food/food.module#FoodModule', canActivate: [AuthenticationService]},
      {path: 'settings', component: SettingsComponent}
    ]
  },
  {
    path: '', component: AuthLayoutComponent,
    children: [
      {path: 'login', loadChildren: './login/login.module#LoginModule'}
    ]
  }
];