import { FoodActions } from '../food.actions';
import { MealEventService } from './meal-event.service';
import { MealService } from './meal.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';


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
  .ofType( FoodActions.MEAL_UPDATED )
  .map( toPayload )
  .switchMap( payload => this.mealSvc.update( payload ) );
  
  constructor( 
   private actions$: Actions,
   private mealEventSvc: MealEventService,
   private mealSvc: MealService 
  ) { }

}
