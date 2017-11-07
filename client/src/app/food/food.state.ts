import * as FoodActions from './food.actions';
import {FoodItem, Meal, MealEvent, MealFoodItem, MealRulesViolation} from './food.interfaces';
import {CalendarEvent} from 'angular-calendar';
import {UUID} from 'angular2-uuid';

export interface FoodState {
  foodItems: FoodItem[];
  meals: Meal[];
  mealEvents: MealEvent[];
  events: Array<CalendarEvent<MealEvent>>;
  currentMeal: Meal;
  currentMealFoodItems: MealFoodItem[];
  currentAgeGroup: string;
  mealRulesViolations: MealRulesViolation[];
  showWeekends: boolean;
  showBackground: boolean;
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
  showWeekends: false,
  showBackground: false
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
    case FoodActions.SHOW_BACKGROUND:
      return setShowBackground(state, action as FoodActions.ShowBackgroundAction);
    case FoodActions.SHOW_WEEKENDS:
      return setShowWeekends(state, action as FoodActions.ShowWeekendsAction);
    case FoodActions.INACTIVATE_MEAL:
      return setInactivateMeal(state, action as FoodActions.InactivateMealAction);
    case FoodActions.MEAL_COMPLIANCE:
      return setMealCompliance(state, action as FoodActions.MealComplianceAction);

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
    start: new Date(mealEvent.startDate),
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

function setShowBackground(state: FoodState, action: FoodActions.ShowBackgroundAction): FoodState {
  return {
    ...state,
    showBackground: action.payload
  }
}

function setShowWeekends(state: FoodState, action: FoodActions.ShowWeekendsAction): FoodState {
  return {
    ...state,
    showWeekends: action.payload
  }
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
