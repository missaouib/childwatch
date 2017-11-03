import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {PageLayoutComponent} from './layouts/page-layout/page-layout.component';
import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'meals', pathMatch: 'full', },
  {
    path: '', component: PageLayoutComponent,
    children: [
      {path: 'meals', loadChildren: './food/food.module#FoodModule'},
    ]
  },
  {
    path: '', component: AuthLayoutComponent,
    children: [
      {path: 'login', loadChildren: './login/login.module#LoginModule'}
    ]
  }
];