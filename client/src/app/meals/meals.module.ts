import { MealQueryService } from './services/meal-query.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { MealsScreenComponent } from './meals-screen/meals-screen.component';
import { MealDetailComponent } from './meal-detail/meal-detail.component';
import { MealActions } from './meal.actions';
import { MealStateService } from './services/meal-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MealsScreenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    ReactiveFormsModule, FormsModule,
    HttpModule
  ],
  declarations: [MealsScreenComponent, MealDetailComponent],
  providers: [ MealQueryService, MealStateService, MealActions ]
})
export class MealsModule {
}
