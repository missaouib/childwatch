import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {SettingsComponent} from './user/settings/settings.component';
import {UserService} from './user/user.service';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'meals', canActivate: [UserService], pathMatch: 'full'},
  {
    path: '', component: PageLayoutComponent, canActivate: [UserService],
    children: [
      {path: 'meals', loadChildren: './food/food.module#FoodModule', canActivate: [UserService]},
      {path: 'settings', component: SettingsComponent}
    ]
  },
  {
    path: '', component: AuthLayoutComponent,
    children: [
      {path: 'login', loadChildren: './user/user.module#UserModule'}
    ]
  }
];