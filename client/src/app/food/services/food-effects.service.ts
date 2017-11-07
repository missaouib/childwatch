/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import * as FoodActions from '../food.actions';
import {Meal, MealFoodItem, MealEvent} from '../food.interfaces';
import {MealEventService} from './meal-event.service';
import {MealService} from './meal.service';
import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import '../../rxjs-imports';

/**
 * FoodEffectsService
 * 
 * @service
 */
@Injectable()
export class FoodEffectsService {

  @Effect({dispatch: false}) adjustedMenuTime = this.actions$.ofType(FoodActions.MENU_TIME_ADJUSTED)
    .map((action: FoodActions.MenuTimeAdjustedAction) => action.payload)
    .do(payload => this.mealEventSvc.queryBetween(payload.start, payload.end).subscribe());

  @Effect() _onSaveMeal = this.actions$.ofType(FoodActions.SAVE_MEAL)
    .map((action: FoodActions.SaveMealAction) => action.payload)
    .switchMap((payload: Meal) => Observable.of(this.onSaveMeal(payload)));


  @Effect() _onLoadMealFoodItemsForMeal = this.actions$.ofType(FoodActions.LOAD_MEALFOODITEMS_FOR_MEAL)
    .map((action: FoodActions.LoadMealFoodItemsForMealAction) => action.payload)
    .switchMap((payload: Meal) => this.onLoadMealFoodItemsForMeal(payload));


  @Effect() _onMealFoodItemReceived = this.actions$.ofType(FoodActions.MEALFOODITEMS_RECEIVED)
    .map((action: FoodActions.MealFoodItemsReceivedAction) => action.payload)
    .switchMap((payload: MealFoodItem[]) => this.onMealFoodItemsReceived(payload));

  @Effect() _onSaveMealFoodItem = this.actions$.ofType(FoodActions.SAVE_MEALFOODITEM)
    .map((action: FoodActions.SaveMealFoodItemAction) => action.payload)
    .switchMap((payload: MealFoodItem) => this.onSaveMealFoodItem(payload));

  @Effect() _onDeleteMealFoodItem = this.actions$.ofType(FoodActions.DELETE_MEALFOODITEM)
    .map((action: FoodActions.DeleteMealFoodItemAction) => action.payload)
    .switchMap((payload: MealFoodItem) => this.onDeleteMealFoodItem(payload));


  @Effect() _onMealEventScheduled = this.actions$.ofType(FoodActions.MEALEVENT_SCHEDULED)
    .map((action: FoodActions.MealEventScheduledAction) => action.payload)
    .switchMap((payload: MealEvent) => this.onMealEventScheduled(payload));

  @Effect() _onMealEventRemoved = this.actions$.ofType(FoodActions.REMOVE_MEALEVENT)
    .map((action: FoodActions.RemoveMealEventAction) => action.payload)
    .switchMap((payload: MealEvent) => this.onMealEventRemoved(payload));


  /**
   * Constructor for the FoodEffectsService
   * 
   * @constructor
   * 
   * @param actions$ - Injected
   * @param mealEventSvc - Injected
   * @param mealSvc - Injected
   */
  constructor(
    private actions$: Actions,
    private mealEventSvc: MealEventService,
    private mealSvc: MealService
  ) {
  }

  private onSaveMeal(meal: Meal) {
    if (meal.id) {
      if (meal.description && meal.type) {
        this.mealSvc.save(meal).subscribe();
      }
      return new FoodActions.LoadMealFoodItemsForMealAction(meal);
    } else {Observable.of({type: 'NOOP-MEALNOTREADYTOSAVE', payload: meal});}
  }

  private onLoadMealFoodItemsForMeal(meal: Meal) {
    this.mealSvc.queryMealFoodItemsFor(meal).subscribe();
    return Observable.of({type: 'NOOP-ONLOADMEALFOODITEMS', payload: meal});
  }

  private onMealFoodItemsReceived(mealFoodItems: MealFoodItem[]) {
    return Observable.of({type: 'NOOP-ONMEALFOODITEMSLOADED', payload: mealFoodItems});
  }

  private onSaveMealFoodItem(mealFoodItem: MealFoodItem) {
    return Observable.of({type: 'MEALFOODITEM_SAVED', payload: mealFoodItem});
  }

  private onDeleteMealFoodItem(mealFoodItem: MealFoodItem) {
    this.mealSvc.deleteMealFoodItem(mealFoodItem.id).subscribe();
    return Observable.of({type: 'MEALFOODITEM_DELETED', payload: mealFoodItem});
  }

  private onMealEventScheduled(mealEvent: MealEvent) {
    this.mealEventSvc.save(mealEvent).first().subscribe();
    return Observable.of({type: 'NOOP-MEALEVENTSAVED', payload: mealEvent});
  }

  private onMealEventRemoved(mealEvent: MealEvent) {
    this.mealEventSvc.delete(mealEvent).first().subscribe();
    return Observable.of({type: 'NOOP-MEALEVENTREMOVED', payload: mealEvent});
  }

}
