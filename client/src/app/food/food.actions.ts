/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
// import * as moment from 'moment';
import {Action} from '@ngrx/store';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';

import {Meal, FoodState, MealEvent, INITIAL_FOODSTATE, MealFoodItem, MealRulesViolation} from './food.interfaces';
import {FoodItem} from './model/food-item';
import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {UUID} from 'angular2-uuid';


/**
 * FoodActions
 * 
 */
@Injectable()
export class FoodActions {

  static DEFAULT_COLOR = {primary: 'black', secondary: 'black'};

  /*
   * Action types
   */
  static FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
  static MEALS_RECEIVED = 'MEALS_RECEIVED';
  static MEAL_EVENTS_RECEIVED = 'MEAL_EVENTS_RECEIVED';
  static MENU_TIME_ADJUSTED = 'MENU_TIME_ADJUSTED';
  static FOOD_ITEM_UPDATED = 'FOOD_ITEM_UPDATED';
  static FOOD_ITEM_DELETED = 'FOOD_ITEM_DELETED';
  static MEALEVENT_SCHEDULED = 'MEALEVENT_SCHEDULED';

  static REMOVE_MEALEVENT = 'REMOVE_MEALEVENT';

  static SAVE_MEAL = 'SAVE_MEAL';
  static MEAL_SAVED = 'MEAL_SAVED';
  static LOAD_MEALFOODITEMS_FOR_MEAL = 'LOAD_MEALFOODITEMS_FOR_MEAL';
  static MEALFOODITEMS_RECEIVED = 'MEALFOODITEMS_RECEIVED';


  static SAVE_MEALFOODITEM = 'SAVE_MEALFOODITEM';
  static MEALFOODITEM_SAVED = 'MEALFOODITEM_SAVED';
  static DELETE_MEALFOODITEM = 'DELETE_MEALFOODITEM';

  static VALIDATE_MEAL = 'VALIDATE_MEAL';
  static MEAL_VIOLATIONS_RECEIVED = 'MEAL_VIOLATIONS_RECIEVED';


  /*
   * Actions
   */
  mealsReceived = ActionCreatorFactory.create<Meal[]>(FoodActions.MEALS_RECEIVED);
  mealEventsReceived = ActionCreatorFactory.create<{start: Date, end: Date, mealEvents: MealEvent[]}>(FoodActions.MEAL_EVENTS_RECEIVED);
  foodItemsReceived = ActionCreatorFactory.create<FoodItem[]>(FoodActions.FOOD_ITEMS_RECEIVED);
  foodItemUpdated = ActionCreatorFactory.create<FoodItem>(FoodActions.FOOD_ITEM_UPDATED);
  foodItemDeleted = ActionCreatorFactory.create<FoodItem>(FoodActions.FOOD_ITEM_DELETED);
  menuTimeAdjusted = ActionCreatorFactory.create<{start: Date, end: Date}>(FoodActions.MENU_TIME_ADJUSTED);

  mealEventScheduled = ActionCreatorFactory.create<MealEvent>(FoodActions.MEALEVENT_SCHEDULED);

  removeMealEvent = ActionCreatorFactory.create<CalendarEvent<MealEvent>>(FoodActions.REMOVE_MEALEVENT);

  saveMeal = ActionCreatorFactory.create<Meal>(FoodActions.SAVE_MEAL);
  mealSaved = ActionCreatorFactory.create<Meal>(FoodActions.MEAL_SAVED);
  loadMealFoodItemsForMeal = ActionCreatorFactory.create<Meal>(FoodActions.LOAD_MEALFOODITEMS_FOR_MEAL);
  mealFoodItemsReceived = ActionCreatorFactory.create<MealFoodItem[]>(FoodActions.MEALFOODITEMS_RECEIVED);

  saveMealFoodItem = ActionCreatorFactory.create<MealFoodItem>(FoodActions.SAVE_MEALFOODITEM);
  mealFoodItemSaved = ActionCreatorFactory.create<MealFoodItem>(FoodActions.MEALFOODITEM_SAVED);
  deleteMealFoodItem = ActionCreatorFactory.create<MealFoodItem>(FoodActions.DELETE_MEALFOODITEM);

  validateMeal = ActionCreatorFactory.create<Meal>(FoodActions.VALIDATE_MEAL);
  mealViolationsReceived = ActionCreatorFactory.create<MealRulesViolation[]>(FoodActions.MEAL_VIOLATIONS_RECEIVED);

  /**
   * Main reducer for all Meal/Food related actions
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static mealReducer(state: FoodState = INITIAL_FOODSTATE, action: Action): FoodState {
    switch (action.type) {
      case FoodActions.FOOD_ITEMS_RECEIVED:
        return FoodActions.setFoodItemsReceived(state, action);
      case FoodActions.MEALS_RECEIVED:
        return FoodActions.setMealsReceived(state, action);
      case FoodActions.MEAL_EVENTS_RECEIVED:
        return FoodActions.setMealEventsReceived(state, action);
      case FoodActions.MENU_TIME_ADJUSTED:
        return FoodActions.setMenuTimeAdjusted(state, action);
      case FoodActions.FOOD_ITEM_UPDATED:
        return FoodActions.setFoodItemUpdated(state, action);
      case FoodActions.MEALEVENT_SCHEDULED:
        return FoodActions.setMealEventScheduled(state, action);
      case FoodActions.REMOVE_MEALEVENT:
        return FoodActions.setRemoveMealEvent(state, action);
      case FoodActions.MEAL_VIOLATIONS_RECEIVED:
        return FoodActions.setMealViolationsReceived(state, action);

      case FoodActions.SAVE_MEAL:
        return FoodActions.setSaveMeal(state, action);
      case FoodActions.MEALFOODITEMS_RECEIVED:
        return FoodActions.setMealFoodItemsReceived(state, action);

      case FoodActions.SAVE_MEALFOODITEM:
        return FoodActions.setSaveMealFoodItem(state, action);
      case FoodActions.DELETE_MEALFOODITEM:
        return FoodActions.setDeleteMealFoodItem(state, action);

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
  static setFoodItemsReceived(state: FoodState, action: Action) {


    return {
      ...state,
      foodItems: action.payload.map((item: any) => Object.assign(new FoodItem(), item))
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
  static setMealsReceived(state: FoodState, action: Action) {

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
  static setMealEventsReceived(state: FoodState, action: Action) {

    const mealEvents: MealEvent[] = action.payload.mealEvents;

    const events = mealEvents.map((mealEvent) => ({
      title: mealEvent.meal.description,
      start: new Date(mealEvent.startDate),
      meta: mealEvent,
      color: FoodActions.DEFAULT_COLOR
    }));

    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        mealEvents: mealEvents,
        events: events
      }
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
  static setRemoveMealEvent(state: FoodState, action: Action) {
    const event: MealEvent = action.payload.meta;
    const mealEvents = state.menuUI.mealEvents.filter((e) => e.id !== event.id);
    const events = state.menuUI.events.filter((e) => e.meta.id !== event.id);
    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        mealEvents: mealEvents,
        events: events
      }
    };
  }

  /**
   * Set store data when a meal is scheduled; in response to the MENU_TIMEADJUSTED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static setMenuTimeAdjusted(state: FoodState, action: Action) {

    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        startMenu: action.payload.start,
        endMenu: action.payload.end
      }
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
  static setFoodItemUpdated(state: FoodState, action: Action) {
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
  static setSaveMeal(state: FoodState, action: Action): FoodState {
    const meal = {...action.payload};

    // assign a GUID if there isnt one
    if (!meal.id) {meal.id = UUID.UUID();}

    const meals = state.meals.filter((m) => m.id !== meal.id);
    meals.push(meal);

    return {
      ...state,
      meals: meals,
      menuUI: {
        ...state.menuUI,
        currentMeal: meal
      }
    };
  }

  /**
   * Set store data when the meal food items come in for the current meal item;
   * in response to the MEALFOODITEMS_RECEIVED action
   */
  static setMealFoodItemsReceived(state: FoodState, action: Action): FoodState {
    const mealFoodItems: MealFoodItem[] = action.payload;
    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        currentMealFoodItems: mealFoodItems
      }
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
  static setSaveMealFoodItem(state: FoodState, action: Action): FoodState {
    const mealFoodItem: MealFoodItem = action.payload;

    const mealFoodItems = state.menuUI.currentMealFoodItems.filter((item) => item.id !== mealFoodItem.id);
    mealFoodItems.push(mealFoodItem);
    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        currentMealFoodItems: mealFoodItems
      }
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
  static setDeleteMealFoodItem(state: FoodState, action: Action): FoodState {
    const mealFoodItem: MealFoodItem = action.payload;

    const mealFoodItems = state.menuUI.currentMealFoodItems.filter((item) => item.id !== mealFoodItem.id);
    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        currentMealFoodItems: mealFoodItems
      }
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
  static setMealEventScheduled(state: FoodState, action: Action) {
    const mealEvent = action.payload;


    const mealEvents = state.menuUI.mealEvents.filter((e) => e.id !== mealEvent.id);

    mealEvents.push(mealEvent);

    const event = {
      title: mealEvent.meal.description,
      start: new Date(mealEvent.startDate),
      meta: mealEvent,
      color: FoodActions.DEFAULT_COLOR
    };

    const events = state.menuUI.events.slice();
    events.push(event);
    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        events: events,
        mealEvents: mealEvents
      }
    };
  }


  static setMealViolationsReceived(state: FoodState, action: Action) {
    const mealRulesViolations = action.payload;

    return {
      ...state,
      menuUI: {
        ...state.menuUI,
        mealRulesViolations: mealRulesViolations
      }
    };
  }

}
