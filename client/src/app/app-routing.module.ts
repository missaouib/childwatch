import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';



export const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', },
  { path: '', component: AdminLayoutComponent,
    children: [
          { path: 'family', loadChildren: './family/family.module#FamilyModule' },
          { path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule' },
          { path: 'meals', loadChildren: './meals/meals.module#MealsModule' },
          { path: 'billing', loadChildren: './billing/billing.module#BillingModule' }
        ]},
    { path: '', component: AuthLayoutComponent,
      children: [
          { path: 'login', loadChildren: './login/login.module#LoginModule' }
      ]}
];


@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {enableTracing: true }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
