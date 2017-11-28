import {ConfigService} from '../config/config.service';
import {MealService} from './services/meal.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {FoodStateService} from './services/food-state.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {MealEventService} from './services/meal-event.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {FoodItemService} from './services/food-item.service';
import {MealCalendarComponent} from './meal-calendar/meal-calendar.component';

import {CalendarModule} from 'angular-calendar';
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
import {MealDayComponent} from './meal-day/meal-day.component';
import {MenuPrintDialogComponent} from './meal-calendar/menu-print-dialog.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MealProductionRecordComponent} from './meal-production-record/meal-production-record.component';


const routes: Routes = [
  {path: '', component: MealCalendarComponent},
  {path: 'meal-builder', component: MealComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'mpr', component: MealProductionRecordComponent},
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
    DndModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    MealCalendarComponent,
    FoodItemComponent, MealComponent, MealPatternHelpComponent, FoodItemListComponent, MealListComponent, MealDayComponent, MenuPrintDialogComponent, MealProductionRecordComponent
  ],
  providers: [FoodItemService, MealService, FoodStateService, MealEventService, PendingChangesGuard, ConfigService],
  entryComponents: [MenuPrintDialogComponent]
})
export class FoodModule {

  constructor(
    //private foodItemSvc: FoodItemService,
    //private mealSvc: MealService
  ) {

    //this.foodItemSvc.query(FoodItemService.FULL).subscribe();
    //this.mealSvc.query().subscribe();
  }
}
