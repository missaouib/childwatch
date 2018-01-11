/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import * as FoodActions from './food.actions';
import {MealEventService} from '../services/meal-event.service';
import {MealService} from '../services/meal.service';
import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import '../../rxjs-imports';
import {FoodItem} from "../model/food-item";
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {MealFoodItem} from '../model/meal-food-item';
import {MealProductionFoodItem} from "../model/meal-production-record";
import {MealProductionRecordService} from "../services/meal-production-record.service";

/**
 * FoodEffects
 */
@Injectable()
export class FoodEffects {

  @Effect({dispatch: false}) _onMenuTimeAdjusted = this.actions$.ofType(FoodActions.MENU_TIME_ADJUSTED)
    .map((action: FoodActions.MenuTimeAdjustedAction) => action.payload)
    .do(payload => this.mealEventSvc.queryBetween(payload.start, payload.end).subscribe());

  @Effect() _onSaveMeal = this.actions$.ofType(FoodActions.SAVE_MEAL)
    .map((action: FoodActions.SaveMealAction) => action.payload)
    .switchMap((payload: Meal) => Observable.of(this.onSaveMeal(payload)));

  @Effect() _onLoadMealFoodItemsForMeal = this.actions$.ofType(FoodActions.LOAD_MEALFOODITEMS_FOR_MEAL)
    .map((action: FoodActions.LoadMealFoodItemsForMealAction) => action.payload)
    .switchMap((payload: Meal) => this.onLoadMealFoodItemsForMeal(payload));

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

  @Effect({dispatch: false}) _onMealProductionRecordLocked = this.actions$.ofType(FoodActions.MEALPRODUCTIONRECORD_LOCKED)
    .map((action: FoodActions.MealProductionRecordLockedAction) => action.payload)
    .do(payload => this.mprSvc.refreshMpr(payload.mprId));

  @Effect({dispatch: false}) _onMealProductionFoodItemUpdated = this.actions$.ofType(FoodActions.MEALPRODUCTIONFOODITEM_UPDATED)
    .map((action: FoodActions.MealProductionFoodItemUpdatedAction) => action.payload)
    .do(payload => this.mprSvc.refreshMpr(payload.mpr.id));

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
    private mealSvc: MealService,
    private mprSvc: MealProductionRecordService
  ) {}

  private onSaveMeal(meal: Meal) {
    if (meal.id) {
      if (meal.description && meal.type) {
        this.mealSvc.update(meal).subscribe();
      }
      return new FoodActions.LoadMealFoodItemsForMealAction(meal);
    } else {Observable.of({type: 'NOOP-MEALNOTREADYTOSAVE', payload: meal});}
  }

  private onLoadMealFoodItemsForMeal(meal: Meal) {
    this.mealSvc.queryMealFoodItemsFor(meal).subscribe();
    return Observable.of({type: 'NOOP-ONLOADMEALFOODITEMS', payload: meal});
  }

  private onSaveMealFoodItem(mealFoodItem: MealFoodItem) {
    return Observable.of({type: 'MEALFOODITEM_SAVED', payload: mealFoodItem});
  }

  private onDeleteMealFoodItem(mealFoodItem: MealFoodItem) {
    this.mealSvc.deleteMealFoodItem(mealFoodItem.id).subscribe();
    return Observable.of({type: 'MEALFOODITEM_DELETED', payload: mealFoodItem});
  }

  private onMealEventScheduled(mealEvent: MealEvent) {
    if (!mealEvent.masterEvent) {
      console.log('Saving the meal event');
      this.mealEventSvc.update(mealEvent).subscribe();
    }
    else {
      console.log(`masterEvent = ${mealEvent.masterEvent}, not saving!`);
    }
    return Observable.of({type: 'NOOP-MEALEVENTSAVED', payload: mealEvent});
  }

  private onMealEventRemoved(mealEvent: MealEvent) {
    if (!mealEvent.masterEvent)
      this.mealEventSvc.delete(mealEvent).first().subscribe();
    return Observable.of({type: 'NOOP-MEALEVENTREMOVED', payload: mealEvent});
  }

}
