import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {SettingsComponent} from './user/settings/settings.component';
import {UserService} from './user/user.service';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'childcare', canActivate: [UserService], pathMatch: 'full'},
  {
    path: '', component: PageLayoutComponent, canActivate: [UserService],
    children: [
      {path: 'childcare', loadChildren: './childcare/childcare.module#ChildcareModule', canActivate: [UserService]},
      {path: 'meals', loadChildren: './cacfp/cacfp.module#CACFPModule', canActivate: [UserService]},
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