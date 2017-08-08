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
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { MenuService } from './services/menu.service';
import { DragulaModule } from 'ng2-dragula';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';

const routes: Routes = [
  { path: 'meal', component: MealsScreenComponent },
  { path: 'menu-overview', component: MenuScreenComponent },
  { path: 'menu', component: MenuDetailComponent }
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
  declarations: [MealsScreenComponent, MealDetailComponent, MenuScreenComponent, MenuCardComponent, MenuDetailComponent],
  providers: [ MealQueryService, MealStateService, MealActions, MenuService ]
})
export class MealsModule {
}
