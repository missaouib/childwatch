import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {SettingsComponent} from './user/settings/settings.component';
import {UserListComponent} from "./user/user-list/user-list.component";
import {UserService} from './user/user.service';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'dashboard', canActivate: [UserService], pathMatch: 'full'},
  {
    path: '', component: PageLayoutComponent, canActivate: [UserService],
    children: [
      {path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [UserService]},
      {path: 'entity', loadChildren: './entity/entity.module#EntityModule', canActivate: [UserService]},
      {path: 'meals', loadChildren: './cacfp/cacfp.module#CACFPModule', canActivate: [UserService]},
      {path: 'settings', component: SettingsComponent},
      {path: 'users', component: UserListComponent}
    ]
  },
  {
    path: '', component: AuthLayoutComponent,
    children: [
      {path: 'login', loadChildren: './user/user.module#UserModule'}
    ]
  }
];