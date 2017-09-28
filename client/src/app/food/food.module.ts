import { MealService } from './services/meal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { FoodActions } from './food.actions';
import { FoodStateService } from './services/food-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MealEventService } from './services/meal-event.service';
import { DragulaModule } from 'ng2-dragula';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FoodComponentService } from './services/food-component.service';
import { FoodItemService } from './services/food-item.service';
import { MealCalendarComponent } from './meal-calendar/meal-calendar.component';

import {CalendarModule} from 'angular-calendar';
import {DragAndDropModule} from 'angular-draggable-droppable';
import { MealBuilderComponent } from './meal-builder/meal-builder.component';
import { PendingChangesGuard } from './meal/pending-changes-guard';

import {EffectsModule} from '@ngrx/effects';

import {FoodEffectsService} from './services/food-effects.service';
import { AlertModule } from 'ngx-bootstrap/alert';
import {SidebarModule} from 'ng-sidebar';
import { MealDayComponent } from './meal-day/meal-day.component';

import {ModalModule} from 'ngx-bootstrap/modal';
import { FoodItemComponent } from './food-item/food-item.component';
import { MealComponent } from './meal/meal.component';
import { MealPatternHelpComponent } from './meal-pattern-help/meal-pattern-help.component';


const routes: Routes = [
  { path: '', component: MealCalendarComponent },
  { path: 'meal-builder', component: MealComponent, canDeactivate: [PendingChangesGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot(),
    DragAndDropModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    HttpModule, DragulaModule,
    EffectsModule.run(FoodEffectsService),
    AlertModule.forRoot(),
    SidebarModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ 
    MealCalendarComponent, 
    MealBuilderComponent, MealDayComponent, FoodItemComponent, MealComponent, MealPatternHelpComponent
  ],
  providers: [ FoodItemService, FoodComponentService, MealService, FoodStateService, FoodActions, MealEventService, PendingChangesGuard ],
  entryComponents: [MealDayComponent]
})
export class FoodModule {
  
  constructor( 
    private foodItemSvc: FoodItemService,
    private foodComponentSvc: FoodComponentService  ) {
    
    this.foodItemSvc.query( FoodItemService.FULL ).subscribe();
    this.foodComponentSvc.query( FoodComponentService.WITH_ID ).subscribe();
  }
}
