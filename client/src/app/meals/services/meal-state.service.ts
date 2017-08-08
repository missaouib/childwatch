import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent, Meal, Menu } from '../meal.interfaces';
import { MealActions } from '../meal.actions';
import { MealQueryService } from './meal-query.service';
import { MenuService } from './menu.service';
import { Effect, Actions, toPayload } from '@ngrx/effects';




@Injectable()
export class MealStateService {

    @Effect() _selectedMeal = this.actions$
      .ofType( MealActions.MEAL_SELECTED )
      .map( toPayload )
      .map( payload => this.querySvc.queryFoodItemsForMeal( payload ).subscribe() )
      .subscribe();

    @Effect() _selectedFoodComponent = this.actions$
     .ofType( MealActions.FOOD_COMPONENT_SELECTED )
    .map( toPayload )
    .map( payload => this.querySvc.queryFoodItems( payload ).subscribe() )
    .subscribe();

    @Effect() _loadedMeals = this.actions$
      .ofType( MealActions.MEALS_RECEIVED )
      .map( toPayload )
      .map( payload => this.store.dispatch(this.mealActions.mealSelected( payload[0] ) ) )
      .subscribe();

    @Effect() _adjustedMenuTime = this.actions$
      .ofType( MealActions.MENU_TIME_ADJUSTED )
      .map( toPayload )
      .map( payload => this.menuSvc.queryBetween( payload.start, payload.end ).subscribe() )
      .subscribe();

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private querySvc: MealQueryService,
    private menuSvc: MenuService,
    private mealActions: MealActions ) {}

  get foodItems$(): Observable<FoodItem[]> {
      return this.store.select( s => ( s.meal.ui.selectedFoodComponent !== undefined ) ? s.meal.ui.selectedFoodComponent.foodItems : [] );
  }

  get foodComponents$(): Observable<FoodComponent[]> {
    return this.store.select( s => s.meal.foodComponents );
  }

  get selectedMeal$(): Observable<Meal>{
    return this.store.select( s => s.meal.ui.selectedMeal );
  }

  set selectedMeal$( meal$: Observable<Meal> ){
    meal$.subscribe( m => this.store.dispatch( this.mealActions.mealSelected(m) ) );
  }

  get meals$(): Observable<Meal[]>{
    return this.store.select( s => s.meal.meals );
  }

  get menus$(): Observable<Menu[]>{
    return this.store.select( s => s.meal.ui.selectedMenus );
  }

  get selectedFoodComponent$(): Observable<FoodComponent> {
    return this.store.select( s => s.meal.ui.selectedFoodComponent );
  }

  set selectedFoodComponent$( component: Observable<FoodComponent> ){
    component.subscribe( c => this.store.dispatch( this.mealActions.foodComponentSelected( c ) ) );
  }

  addMenuItem( menuItem: { type: string } ) {
    this.store.dispatch( this.mealActions.addMenuItem( menuItem ) );
  }

  adjustMenuTime( start: Date, end: Date ) {
    this.store.dispatch( this.mealActions.menuTimeAdjusted( { start: start, end: end } ) );
  }
}
