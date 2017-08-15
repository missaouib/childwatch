import { MealService } from './services/meal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { MealDetailComponent } from './meal-detail/meal-detail.component';
import { FoodActions } from './food.actions';
import { FoodStateService } from './services/food-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { MenuService } from './services/menu.service';
import { DragulaModule } from 'ng2-dragula';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { FoodComponentService } from './services/food-component.service';
import { FoodItemService } from './services/food-item.service';

const routes: Routes = [
  { path: 'menu-overview', component: MenuScreenComponent },
  { path: 'menu/:id', component: MenuDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    HttpModule, DragulaModule
  ],
  declarations: [MealDetailComponent, MenuScreenComponent, MenuCardComponent, MenuDetailComponent],
  providers: [ FoodItemService, FoodComponentService, MealService, FoodStateService, FoodActions, MenuService ]
})
export class FoodModule {
  
  constructor( 
    private foodItemSvc: FoodItemService,
    private foodComponentSvc: FoodComponentService  ) {
    
    this.foodItemSvc.query( FoodItemService.FULL ).subscribe();
    this.foodComponentSvc.query( FoodComponentService.FULL ).subscribe();
  }
}
