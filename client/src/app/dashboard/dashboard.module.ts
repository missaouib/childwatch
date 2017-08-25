import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];
@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ DashboardComponent ],
  providers: [ ]
})
export class DashboardModule {}
