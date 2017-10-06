import {MealService} from './services/meal.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {FoodActions} from './food.actions';
import {FoodStateService} from './services/food-state.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {MealEventService} from './services/meal-event.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {FoodComponentService} from './services/food-component.service';
import {FoodItemService} from './services/food-item.service';
import {MealCalendarComponent} from './meal-calendar/meal-calendar.component';

import {CalendarModule} from 'angular-calendar';
import {MealBuilderComponent} from './meal-builder/meal-builder.component';
import {PendingChangesGuard} from './meal/pending-changes-guard';

import {DndModule} from 'ng2-dnd';

import {EffectsModule} from '@ngrx/effects';

import {FoodEffectsService} from './services/food-effects.service';
import {AlertModule} from 'ngx-bootstrap/alert';
import {SidebarModule} from 'ng-sidebar';

import {ModalModule} from 'ngx-bootstrap/modal';
import {FoodItemComponent} from './food-item/food-item.component';
import {MealComponent} from './meal/meal.component';
import {MealPatternHelpComponent} from './meal-pattern-help/meal-pattern-help.component';
import {FoodItemListComponent} from './food-item-list/food-item-list.component';

import {PaginationModule} from 'ngx-bootstrap/pagination';
import {MealListComponent} from './meal-list/meal-list.component';
import { MealDayComponent } from './meal-day/meal-day.component';


const routes: Routes = [
  {path: '', component: MealCalendarComponent},
  {path: 'meal-builder', component: MealComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'food-item-list', component: FoodItemListComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    HttpModule,
    EffectsModule.run(FoodEffectsService),
    AlertModule.forRoot(),
    SidebarModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    DndModule.forRoot()
  ],
  declarations: [
    MealCalendarComponent,
    MealBuilderComponent, FoodItemComponent, MealComponent, MealPatternHelpComponent, FoodItemListComponent, MealListComponent, MealDayComponent
  ],
  providers: [FoodItemService, FoodComponentService, MealService, FoodStateService, FoodActions, MealEventService, PendingChangesGuard]
})
export class FoodModule {

  constructor(
    private foodItemSvc: FoodItemService) {

    this.foodItemSvc.query(FoodItemService.FULL).subscribe();
    // this.foodComponentSvc.query(FoodComponentService.WITH_ID).subscribe();
  }
}
