import { FoodActions } from '../food.actions';
import { MealEventService } from './meal-event.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';


@Injectable()
export class FoodEffectsService {

    @Effect() _adjustedMenuTime = this.actions$
    .ofType( FoodActions.MENU_TIME_ADJUSTED )
    .map( toPayload )
    .map( payload => this.mealEventSvc.queryBetween( payload.start, payload.end ).subscribe() )
    .subscribe();
  
  constructor( 
    private actions$: Actions,
    private mealEventSvc: MealEventService ) { }

}
