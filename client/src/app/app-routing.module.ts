
import { ChildDetailComponent } from './child/child-detail/child-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { RoomDetailsComponent } from './rooms/room-details/room-details.component';



export const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', },
  { path: '', component: AdminLayoutComponent,
    children: [
          { path: 'family', loadChildren: './family/family.module#FamilyModule' },
          { path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule' },
          { path: 'meals', loadChildren: './food/food.module#FoodModule' },
          { path: 'billing', loadChildren: './billing/billing.module#BillingModule' },
          { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
          { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
          { path: 'room', component: RoomDetailsComponent },
          { path: 'child-detail', component: ChildDetailComponent }
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
