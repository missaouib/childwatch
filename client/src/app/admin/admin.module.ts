import { FoodActions } from '../food/food.actions';
import { FoodComponentService } from '../food/services/food-component.service';
import { FoodItemService } from '../food/services/food-item.service';
import { FoodStateService } from '../food/services/food-state.service';
import { MenuService } from '../food/services/menu.service';
import { FoodItemListComponent } from './food-item-list/food-item-list.component';
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
  providers: [ FoodComponentService, FoodItemService, FoodStateService, MenuService, FoodActions ]
})

export class AdminModule {
  
    constructor( 
    private foodItemSvc: FoodItemService,
    private foodComponentSvc: FoodComponentService  ) {
    
    this.foodItemSvc.query( FoodItemService.FULL ).subscribe();
    this.foodComponentSvc.query( FoodComponentService.FULL ).subscribe();
  }
  
  
}
