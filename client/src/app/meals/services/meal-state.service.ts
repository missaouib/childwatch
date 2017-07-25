import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent, Meal } from '../meal.interfaces';
import { foodComponentSelected, mealSelected } from '../meal.state';
import { FOOD_COMPONENT_SELECTED, MEALS_RECEIVED } from '../meal.state';
import { MealQueryService } from './meal-query.service';
import { Effect, Actions, toPayload } from '@ngrx/effects';




@Injectable()
export class MealStateService {

    @Effect() _selectedFoodComponent = this.actions$
     .ofType( FOOD_COMPONENT_SELECTED )
    .map( toPayload )
    .map( payload => Observable.of( this.querySvc.queryFoodItems( payload ) ) )
    .subscribe();

    @Effect() _loadedMeals = this.actions$
      .ofType( MEALS_RECEIVED )
      .map( toPayload )
      .map( payload => this.store.dispatch(mealSelected( payload[0] ) ) )
      .subscribe();

  constructor(private store: Store<AppState>, private actions$: Actions, private querySvc: MealQueryService ) {}

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
    meal$.subscribe( m => this.store.dispatch( mealSelected(m) ) );
  }

  get meals$(): Observable<Meal[]>{
    return this.store.select( s => s.meal.meals );
  }

  get selectedFoodComponent$(): Observable<FoodComponent> {
    return this.store.select( s => s.meal.ui.selectedFoodComponent );
  }

  set selectedFoodComponent$( component: Observable<FoodComponent> ){
    component.subscribe( c => this.store.dispatch( foodComponentSelected( c ) ) );
  }

}
