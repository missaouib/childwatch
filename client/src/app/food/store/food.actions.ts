/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
// import * as moment from 'moment';
import {FoodItem} from '../model/food-item';
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {MealFoodItem} from '../model/meal-food-item';
import {MealProductionRecord, MealProductionFoodItem, MealAttendanceRecord} from '../model/meal-production-record';
import {MealRulesViolation} from '../model/mealrulesviolation';
import {Action} from '@ngrx/store';


/*
 * Types 
 */
export const FOODITEMS_RECEIVED: string = '[FOOD] FOODITEMS RECEIVED';
export const MEALS_RECEIVED: string = '[FOOD] MEALS RECEIVED';
export const MEALEVENTS_RECEIVED: string = '[FOOD] MEALEVENTS RECEIVED';
export const MENU_TIME_ADJUSTED: string = '[FOOD] MENU TIME ADJUSTED';
export const FOODITEM_UPDATED: string = '[FOOD] FOODITEM UPDATED';
export const FOODITEM_DELETED: string = '[FOOD] FOODITEM DELETED';
export const MEALEVENT_SCHEDULED: string = '[FOOD] MEALEVENT SCHEDULED';
export const REMOVE_MEALEVENT: string = '[FOOD] REMOVE MEALEVENT';
export const SAVE_MEAL: string = '[FOOD] SAVE MEAL';
export const MEAL_SAVED: string = '[FOOD] MEAL SAVED';
export const LOAD_MEALFOODITEMS_FOR_MEAL: string = '[FOOD] LOAD MEALFOODITEMS FOR MEAL';
export const MEALFOODITEMS_RECEIVED: string = '[FOOD] MEALFOODITEMS RECEIVED';
export const SAVE_MEALFOODITEM: string = '[FOOD] SAVE MEALFOODITEM';
export const MEALFOODITEM_SAVED: string = '[FOOD] MEALFOODITEM SAVED';
export const DELETE_MEALFOODITEM: string = '[FOOD] DELETE MEALFOODITEM';
export const VALIDATE_MEAL: string = '[FOOD] VALIDATE MEAL';
export const MEALRULESVIOLATIONS_RECEIVED: string = '[FOOD] MEALRULESVIOLATIONS RECIEVED';
export const INACTIVATE_MEAL: string = '[FOOD] INACTIVATE MEAL';
export const MEAL_COMPLIANCE: string = '[FOOD] MEAL COMPLIANCE';

export const MEALPRODUCTIONRECORDS_RECEIVED: string = '[FOOD] MEALPRODUCTIONRECORD RECEIVED';
export const MEALPRODUCTIONFOODITEMS_RECEIVED: string = '[FOOD] MEALPRODUCTIONFOODITEMS RECEIVED';
export const MEALATTENDANCERECORDS_RECEIVED: string = '[FOOD] MEALATTENDANCERECORDS RECEIVED';

export const ACTIVATE_MEALPRODUCTIONRECORD: string = '[FOOD] ACTIVATE MEALPRODUCTIONRECORD';
export const MEALATTENDANCERECORD_UPDATED: string = '[FOOD] MEALATTENDANCERECORD UPDATED';
export const MEALPRODUCTIONRECORD_LOCKED: string = '[FOOD] MEALPRODUCTIONRECORD LOCKED';

export class MealsReceivedAction implements Action {
  readonly type = MEALS_RECEIVED;
  constructor(public payload: Meal[]) {};
}

export class MealEventsReceivedAction implements Action {
  readonly type = MEALEVENTS_RECEIVED;
  constructor(public payload: MealEvent[]) {};
}

export class FoodItemsReceivedAction implements Action {
  readonly type = FOODITEMS_RECEIVED;
  constructor(public payload: FoodItem[]) {};
}

export class FoodItemUpdatedAction implements Action {
  readonly type = FOODITEM_UPDATED;
  constructor(public payload: FoodItem) {};
}

export class FoodItemDeletedAction implements Action {
  readonly type = FOODITEM_DELETED;
  constructor(public payload: FoodItem) {};
}

export class MenuTimeAdjustedAction implements Action {
  readonly type = MENU_TIME_ADJUSTED;
  constructor(public payload: {start: Date, end: Date}) {};
}

export class MealEventScheduledAction implements Action {
  readonly type = MEALEVENT_SCHEDULED;
  constructor(public payload: MealEvent) {};
}

export class RemoveMealEventAction implements Action {
  readonly type = REMOVE_MEALEVENT;
  constructor(public payload: MealEvent) {};
}

export class SaveMealAction implements Action {
  readonly type = SAVE_MEAL;
  constructor(public payload: Meal) {};
}

export class MealSavedAction implements Action {
  readonly type = MEAL_SAVED;
  constructor(public payload: Meal) {};
}

export class LoadMealFoodItemsForMealAction implements Action {
  readonly type = LOAD_MEALFOODITEMS_FOR_MEAL;
  constructor(public payload: Meal) {};
}

export class MealFoodItemsReceivedAction implements Action {
  readonly type = MEALFOODITEMS_RECEIVED;
  constructor(public payload: MealFoodItem[]) {};
}

export class SaveMealFoodItemAction implements Action {
  readonly type = SAVE_MEALFOODITEM;
  constructor(public payload: MealFoodItem) {};
}

export class MealFoodItemSavedAction implements Action {
  readonly type = MEALFOODITEM_SAVED;
  constructor(public payload: MealFoodItem) {};
}

export class DeleteMealFoodItemAction implements Action {
  readonly type = DELETE_MEALFOODITEM;
  constructor(public payload: MealFoodItem) {};
}

export class ValidateMealAction implements Action {
  readonly type = VALIDATE_MEAL;
  constructor(public payload: Meal) {};
}

export class MealRulesViolationsReceivedAction implements Action {
  readonly type = MEALRULESVIOLATIONS_RECEIVED;
  constructor(public payload: MealRulesViolation[]) {};
}


export class InactivateMealAction implements Action {
  readonly type = INACTIVATE_MEAL;
  constructor(public payload: Meal) {};
}

export class MealComplianceAction implements Action {
  readonly type = MEAL_COMPLIANCE;
  constructor(public payload: {meal: Meal, compliance?: boolean}) {};
}

export class MealProductionRecordsReceivedAction implements Action {
  readonly type = MEALPRODUCTIONRECORDS_RECEIVED;
  constructor(public payload: MealProductionRecord[]) {};
}

export class MealProductionFoodItemsReceivedAction implements Action {
  readonly type = MEALPRODUCTIONFOODITEMS_RECEIVED;
  constructor(public payload: MealProductionFoodItem[]) {};
}

export class MealAttendanceRecordsReceivedAction implements Action {
  readonly type = MEALATTENDANCERECORDS_RECEIVED;
  constructor(public payload: MealAttendanceRecord[]) {};
}

export class ActivateMealProductionRecordAction implements Action {
  readonly type = ACTIVATE_MEALPRODUCTIONRECORD;
  constructor(public payload: MealProductionRecord) {};
}

export class MealAttendanceRecordUpdatedAction implements Action {
  readonly type = MEALATTENDANCERECORD_UPDATED;
  constructor(public payload: MealAttendanceRecord) {};
}

export class MealProductionRecordLockedAction implements Action {
  readonly type = MEALPRODUCTIONRECORD_LOCKED;
  constructor(public payload: {mprId: string, locked: boolean}) {};
}

export type ACTIONS
  = MealsReceivedAction
  | MealEventsReceivedAction
  | FoodItemsReceivedAction
  | FoodItemUpdatedAction
  | FoodItemDeletedAction
  | MenuTimeAdjustedAction
  | MealEventScheduledAction
  | RemoveMealEventAction
  | SaveMealAction
  | MealSavedAction
  | LoadMealFoodItemsForMealAction
  | MealFoodItemsReceivedAction
  | SaveMealFoodItemAction
  | MealFoodItemSavedAction
  | DeleteMealFoodItemAction
  | ValidateMealAction
  | MealRulesViolationsReceivedAction
  | InactivateMealAction
  | MealComplianceAction
  | MealProductionRecordsReceivedAction
  | MealProductionFoodItemsReceivedAction
  | MealAttendanceRecordsReceivedAction
  | ActivateMealProductionRecordAction
  | MealAttendanceRecordUpdatedAction
  | MealProductionRecordLockedAction;
