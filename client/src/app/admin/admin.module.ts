import { AdminActions } from './admin.actions';
import { FoodItemListComponent } from './food-item-list/food-item-list.component';
import { AdminQueryService } from './services/admin-query.service';
import { AdminStateService } from './services/admin-state.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: FoodItemListComponent },
  { path: 'food-items', component: FoodItemListComponent }
 
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot()
  ],
  declarations: [FoodItemListComponent],
  providers: [ AdminQueryService, AdminStateService, AdminActions ]
})

export class AdminModule {}
