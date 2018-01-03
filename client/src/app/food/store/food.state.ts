import * as FoodActions from './food.actions';
import {FoodItem} from '../model/food-item';
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {MealFoodItem} from '../model/meal-food-item';
import {MealProductionRecord} from '../model/meal-production-record';
import {MealRulesViolation} from '../model/mealrulesviolation';
import {CalendarEvent} from 'angular-calendar';
import {UUID} from 'angular2-uuid';
import * as moment from 'moment';

export interface FoodState {
  foodItems: FoodItem[];
  meals: Meal[];
  mealEvents: MealEvent[];
  events: Array<CalendarEvent<MealEvent>>;
  currentMeal: Meal;
  currentMealFoodItems: MealFoodItem[];
  currentAgeGroup: string;
  mealRulesViolations: MealRulesViolation[];
  mealProductionRecords: MealProductionRecord[];
  activeMPR: MealProductionRecord;
};

export const INITIAL: FoodState = {
  foodItems: [],
  meals: [],
  mealEvents: [],
  events: [],
  currentMeal: {
    id: undefined,
    description: undefined,
    type: undefined
  },
  currentMealFoodItems: [],
  currentAgeGroup: 'AGE_0-5MO',
  mealRulesViolations: [],
  mealProductionRecords: [],
  activeMPR: undefined
};


/**
 * Main reducer for all Meal/Food related actions
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
export function reducer(state: FoodState = INITIAL, action: FoodActions.ACTIONS): FoodState {
  switch (action.type) {
    case FoodActions.FOODITEMS_RECEIVED:
      return setFoodItemsReceived(state, action as FoodActions.FoodItemsReceivedAction);
    case FoodActions.MEALS_RECEIVED:
      return setMealsReceived(state, action as FoodActions.MealsReceivedAction);
    case FoodActions.MEALEVENTS_RECEIVED:
      return setMealEventsReceived(state, action as FoodActions.MealEventsReceivedAction);
    case FoodActions.FOODITEM_UPDATED:
      return setFoodItemUpdated(state, action as FoodActions.FoodItemUpdatedAction);
    case FoodActions.MEALEVENT_SCHEDULED:
      return setMealEventScheduled(state, action as FoodActions.MealEventScheduledAction);
    case FoodActions.REMOVE_MEALEVENT:
      return setRemoveMealEvent(state, action as FoodActions.RemoveMealEventAction);
    case FoodActions.MEALRULESVIOLATIONS_RECEIVED:
      return setMealRulesViolationsReceived(state, action as FoodActions.MealRulesViolationsReceivedAction);
    case FoodActions.SAVE_MEAL:
      return setSaveMeal(state, action as FoodActions.SaveMealAction);
    case FoodActions.MEALFOODITEMS_RECEIVED:
      return setMealFoodItemsReceived(state, action as FoodActions.MealFoodItemsReceivedAction);
    case FoodActions.SAVE_MEALFOODITEM:
      return setSaveMealFoodItem(state, action as FoodActions.SaveMealFoodItemAction);
    case FoodActions.DELETE_MEALFOODITEM:
      return setDeleteMealFoodItem(state, action as FoodActions.DeleteMealFoodItemAction);
    case FoodActions.INACTIVATE_MEAL:
      return setInactivateMeal(state, action as FoodActions.InactivateMealAction);
    case FoodActions.MEAL_COMPLIANCE:
      return setMealCompliance(state, action as FoodActions.MealComplianceAction);
    case FoodActions.MEALPRODUCTIONRECORDS_RECEIVED:
      return setMealProductionRecordsReceived(state, action as FoodActions.MealProductionRecordsReceivedAction);
    case FoodActions.MEALPRODUCTIONFOODITEMS_RECEIVED:
      return setMealProductionFoodItemsReceived(state, action as FoodActions.MealProductionFoodItemsReceivedAction);
    case FoodActions.ACTIVATE_MEALPRODUCTIONRECORD:
      return setActivateMealProductionRecord(state, action as FoodActions.ActivateMealProductionRecordAction);
    case FoodActions.MEALATTENDANCERECORD_UPDATED:
      return setMealAttendanceRecordUpdated(state, action as FoodActions.MealAttendanceRecordUpdatedAction);
    case FoodActions.MEALPRODUCTIONRECORD_LOCKED:
      return setMealProductionRecordLocked(state, action as FoodActions.MealProductionRecordLockedAction);

  }
  return state;
}

/**
 * Set store data when a meal is scheduled; in response to the FOOD_ITEMS_RECEIVED action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setFoodItemsReceived(state: FoodState, action: FoodActions.FoodItemsReceivedAction): FoodState {
  return {
    ...state,
    foodItems: action.payload
  };
}


/**
 * Set store data when a meal is scheduled; in response to the MEALS_RECEIVED action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setMealsReceived(state: FoodState, action: FoodActions.MealsReceivedAction): FoodState {
  return {
    ...state,
    meals: action.payload
  };
}

/**
 * Set store data when a meal is scheduled; in response to the MEAL_EVENTS_RECEIVED action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setMealEventsReceived(state: FoodState, action: FoodActions.MealEventsReceivedAction): FoodState {

  const mealEvents: MealEvent[] = action.payload;

  const events = mealEvents.map((mealEvent) => ({
    title: mealEvent.meal.description,
    start: moment(mealEvent.startDate).toDate(),
    meta: mealEvent,
    color: {primary: 'black', secondary: 'black'}
  }));

  return {
    ...state,
    mealEvents: mealEvents,
    events: events
  };
}


/**
 * Set store date when a meal event is removed; in response to REMOVE_MEALEVENT
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 * 
 */
function setRemoveMealEvent(state: FoodState, action: FoodActions.RemoveMealEventAction): FoodState {
  const event: MealEvent = action.payload;
  const mealEvents = state.mealEvents.filter((e) => e.id !== event.id);
  const events = state.events.filter((e) => e.meta.id !== event.id);
  return {
    ...state,
    mealEvents: mealEvents,
    events: events
  };
}


/**
 * Set store data when a meal is scheduled; in response to the FOODITEM_UPDATED action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setFoodItemUpdated(state: FoodState, action: FoodActions.FoodItemUpdatedAction): FoodState {
  const foodItem = action.payload;
  const idxFoodItem = state.foodItems.findIndex((fi: FoodItem) => fi.id === foodItem.id);
  const foodItems = state.foodItems.filter((fi: FoodItem) => fi.id !== foodItem.id);
  foodItems.splice(idxFoodItem, 0, foodItem);
  return {
    ...state,
    foodItems: foodItems
  };
}


/**
 * Set store data when a meal is scheduled; in response to the SAVE_MEAL action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setSaveMeal(state: FoodState, action: FoodActions.SaveMealAction): FoodState {
  const meal = {...action.payload};

  // assign a GUID if there isnt one
  if (!meal.id) {meal.id = UUID.UUID();}

  const meals = state.meals.filter((m) => m.id !== meal.id);
  meals.push(meal);

  return {
    ...state,
    meals: meals,
    currentMeal: meal
  };
}

/**
 * Set store data when the meal food items come in for the current meal item;
 * in response to the MEALFOODITEMS_RECEIVED action
 */
function setMealFoodItemsReceived(state: FoodState, action: FoodActions.MealFoodItemsReceivedAction): FoodState {
  const mealFoodItems: MealFoodItem[] = action.payload;
  return {
    ...state,
    currentMealFoodItems: mealFoodItems
  };
}

/**
 * Set store data when a mealFoodItem is saved; 
 * in response to the SAVE_MEALFOODITEM action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setSaveMealFoodItem(state: FoodState, action: FoodActions.SaveMealFoodItemAction): FoodState {
  const mealFoodItem: MealFoodItem = action.payload;

  const mealFoodItems = state.currentMealFoodItems.filter((item) => item.id !== mealFoodItem.id);
  mealFoodItems.push(mealFoodItem);
  return {
    ...state,
    currentMealFoodItems: mealFoodItems
  };
}

/**
 * Set store data when a mealFoodItem is deleted; 
 * in response to the DELETE_MEALFOODITEM action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setDeleteMealFoodItem(state: FoodState, action: FoodActions.DeleteMealFoodItemAction): FoodState {
  const mealFoodItem: MealFoodItem = action.payload;

  const mealFoodItems = state.currentMealFoodItems.filter((item) => item.id !== mealFoodItem.id);
  return {
    ...state,
    currentMealFoodItems: mealFoodItems
  };

}

/**
 * Set store data when a meal is scheduled; in response to the MEAL_SCHEDULED action
 * 
 * @param {FoodState} state current food state (immutable)
 * @param {Action} action action that triggered the event
 * 
 * @return {FoodState} next state
 */
function setMealEventScheduled(state: FoodState, action: FoodActions.MealEventScheduledAction): FoodState {
  const mealEvent = action.payload;


  const mealEvents = state.mealEvents.filter((e) => e.id !== mealEvent.id);

  mealEvents.push(mealEvent);

  const event = {
    title: mealEvent.meal.description,
    start: new Date(mealEvent.startDate),
    meta: mealEvent,
    color: {primary: 'black', secondary: 'black'}
  };

  const events = state.events.slice();
  events.push(event);
  return {
    ...state,
    events: events,
    mealEvents: mealEvents
  };
}


function setMealRulesViolationsReceived(state: FoodState, action: FoodActions.MealRulesViolationsReceivedAction): FoodState {
  const mealRulesViolations = action.payload;

  return {
    ...state,
    mealRulesViolations: mealRulesViolations
  };
}


function setInactivateMeal(state: FoodState, action: FoodActions.InactivateMealAction): FoodState {
  const meal: Meal = {...action.payload};
  meal.inactive = true;
  const meals: Meal[] = state.meals.filter(m => m.id !== meal.id);

  meals.push(meal);

  return {
    ...state,
    meals: meals
  };
}

function setMealCompliance(state: FoodState, action: FoodActions.MealComplianceAction): FoodState {
  const meal = {...action.payload.meal}, compliance = action.payload.compliance;
  meal.compliant = compliance;

  const meals: Meal[] = state.meals.filter(m => m.id !== meal.id);
  meals.push(meal);

  return {
    ...state,
    meals: meals
  };
}

function setMealProductionRecordsReceived(state: FoodState, action: FoodActions.MealProductionRecordsReceivedAction): FoodState {
  return {
    ...state,
    mealProductionRecords: action.payload
  };
}

function setMealProductionFoodItemsReceived(state: FoodState, action: FoodActions.MealProductionFoodItemsReceivedAction): FoodState {


  console.log(`there are ${action.payload.length} MPR Food Items`);

  const mprs = state.mealProductionRecords.filter(mpr => mpr.id != state.activeMPR.id);

  const copyActiveMpr = {
    ...state.activeMPR,
    productionFoodItems: action.payload
  };

  mprs.push(copyActiveMpr);

  return {
    ...state,
    activeMPR: copyActiveMpr,
    mealProductionRecords: mprs
  };
}

function setActivateMealProductionRecord(state: FoodState, action: FoodActions.ActivateMealProductionRecordAction): FoodState {
  return {
    ...state,
    activeMPR: action.payload
  };
}


function setMealAttendanceRecordUpdated(state, action: FoodActions.MealAttendanceRecordUpdatedAction): FoodState {

  console.log('Updating MAR');

  const attendanceRecords = state.activeMPR.attendanceRecords.filter(mar => mar.id != action.payload.id);
  attendanceRecords.push(action.payload);

  const copyActiveMpr = {
    ...state.activeMPR,
    attendanceRecords: attendanceRecords
  };

  const mprs = state.mealProductionRecords.filter(mpr => mpr.id != state.activeMPR.id);
  mprs.push(copyActiveMpr);

  return {
    ...state,
    activeMPR: copyActiveMpr,
    mealProductionRecords: mprs
  };

}

function setMealProductionRecordLocked(state, action: FoodActions.MealProductionRecordLockedAction): FoodState {

  const mpr = state.mealProductionRecords.find(mpr => mpr.id == action.payload.mprId);

  if (mpr) {
    const copyMpr = {...mpr, locked: action.payload.locked};

    const mprs = state.mealProductionRecords.filter(mpr => mpr.id != state.activeMPR.id);
    mprs.push(copyMpr);

    const copyActiveMPR = (state.activeMPR && mpr.id == state.activeMPR.id) ? mpr : state.activeMPR;

    return {
      ...state,
      activeMPR: copyActiveMPR,
      mealProductionRecords: mprs
    };
  }
  return state;
}

