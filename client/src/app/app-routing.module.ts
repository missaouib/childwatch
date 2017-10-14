
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {BasicLayoutComponent} from './layouts/basic-layout/basic-layout.component';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';




export const AppRoutes: Routes = [
  {path: '', redirectTo: 'meals', pathMatch: 'full', },
  {
    path: '', component: BasicLayoutComponent,
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


@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
