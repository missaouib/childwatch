import { FoodActions } from '../food.actions';
import { MealEventService } from './meal-event.service';
import { MealService } from './meal.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {UUID} from 'angular2-uuid';


@Injectable()
export class FoodEffectsService {

  @Effect() _adjustedMenuTime = this.actions$
    .ofType( FoodActions.MENU_TIME_ADJUSTED )
    .map( toPayload )
    .switchMap( payload => {
        this.mealEventSvc.queryBetween( payload.start, payload.end ).subscribe();
        return Observable.of( {type: 'MEALS_QUERY' } );
  });
  
  /**
   * Side effect when a meal is updated; saves the meal to the database
   */
  @Effect() _mealUpdated = this.actions$
    .ofType( FoodActions.SAVE_MEAL )
    .map( toPayload )
    .switchMap( (payload) => {    
        const meal = {...payload };
        if ( !meal.id ) { meal.id = UUID.UUID(); }
        this.mealSvc.update( meal ).subscribe();
        return Observable.of({
          type: FoodActions.MEAL_UPDATED,
          payload: meal
        }); 
      });
  
  
  @Effect() _mealFoodItemSaved = this.actions$
    .ofType( FoodActions.SAVE_MEALFOODITEM )
    .map( toPayload )
    .switchMap( (payload) => { 
      console.log( 'Saving mealFoodItem' );
      console.log( payload );
      return Observable.of( {         
        type: FoodActions.MEALFOODITEM_UPDATED,
        payload: undefined 
        });
    });
  
  constructor( 
   private actions$: Actions,
   private mealEventSvc: MealEventService,
   private mealSvc: MealService
  ) {} 

}
