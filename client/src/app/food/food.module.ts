import {UserService} from '../user/user.service';
import {MealService} from './services/meal.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {FoodStateService} from './services/food-state.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {MealEventService} from './services/meal-event.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {FoodItemService} from './services/food-item.service';
import {MealCalendarComponent} from './components/meal-calendar/meal-calendar.component';

import {CalendarModule} from 'angular-calendar';
import {PendingChangesGuard} from './components/meal/pending-changes-guard';

import {DndModule} from 'ng2-dnd';

import {EffectsModule} from '@ngrx/effects';

import {FoodEffects} from './store/food.effects';
import {AlertModule} from 'ngx-bootstrap/alert';
import {SidebarModule} from 'ng-sidebar';

import {ModalModule} from 'ngx-bootstrap/modal';
import {FoodItemComponent} from './components/food-item/food-item.component';
import {MealComponent} from './components/meal/meal.component';
import {MealPatternHelpComponent} from './components/meal-pattern-help/meal-pattern-help.component';
import {FoodItemListComponent} from './components/food-item-list/food-item-list.component';

import {PaginationModule} from 'ngx-bootstrap/pagination';
import {MealListComponent} from './components/meal-list/meal-list.component';
import {MealDayComponent} from './components/meal-day/meal-day.component';
import {MenuPrintDialogComponent} from './components/meal-calendar/menu-print-dialog/menu-print-dialog.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MealProductionRecordComponent} from './components/meal-production-record/meal-production-record.component';
import {MealProductionRecordService} from './services/meal-production-record.service';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {MealProductionRecordTabComponent} from './components/meal-production-record/meal-production-record-tab/meal-production-record-tab.component';
import {FoodItemEditListComponent} from './components/food-item-edit-list/food-item-edit-list.component';
import {EditableFoodItemComponent} from './components/food-item-edit-list/editable-food-item.component';
import {TagInputModule} from 'ngx-chips';
import {RecurrenceDialogComponent} from './components/meal-calendar/recurrence-dialog/recurrence-dialog.component';


const routes: Routes = [
  {path: '', component: MealCalendarComponent},
  {path: 'meal-builder', component: MealComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'mpr', component: MealProductionRecordComponent},
  {path: 'food-items', component: FoodItemEditListComponent},
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
    HttpClientModule,
    EffectsModule.forFeature([FoodEffects]),
    AlertModule.forRoot(),
    SidebarModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    DndModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
  ],
  declarations: [
    MealCalendarComponent,
    FoodItemComponent, MealComponent, MealPatternHelpComponent, FoodItemListComponent, MealListComponent, MealDayComponent, MenuPrintDialogComponent, MealProductionRecordComponent, MealProductionRecordTabComponent, FoodItemEditListComponent, EditableFoodItemComponent, RecurrenceDialogComponent
  ],
  providers: [FoodItemService, MealService, FoodStateService, MealEventService, PendingChangesGuard, UserService, MealProductionRecordService],
  entryComponents: [MenuPrintDialogComponent, RecurrenceDialogComponent]
})
export class FoodModule {

  constructor() {}
}
