import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent } from '../meal.interfaces';
import { foodComponentSelected } from '../meal.state';
import { FOOD_COMPONENT_SELECTED } from '../meal.state';
import { MealQueryService } from './meal-query.service';
import { Effect, Actions, toPayload } from '@ngrx/effects';




@Injectable()
export class MealStateService {

    @Effect() _selectedFoodComponent = this.actions$
     .ofType( FOOD_COMPONENT_SELECTED )
    .map( toPayload )
    .switchMap( payload => this.querySvc.queryFoodItems( payload ) )
    .subscribe();

  constructor(private store: Store<AppState>, private actions$: Actions, private querySvc: MealQueryService ) {}

  get foodItems$(): Observable<FoodItem[]> {
    return this.store.select(s => s.meal.foodItems);
  }

  get foodComponents$(): Observable<FoodComponent[]> {
    return this.store.select( s => s.meal.foodComponents );
  }

  get selectedFoodComponent$(): Observable<FoodComponent> {
    return this.store.select( s => s.meal.selectedFoodComponent );
  }

  set selectedFoodComponent$( component: Observable<FoodComponent> ){
    component.subscribe( c => this.store.dispatch( foodComponentSelected( c ) ) );
    ;
  }

}
