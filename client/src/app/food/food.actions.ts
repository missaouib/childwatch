/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import * as moment from 'moment';
import { Action } from '@ngrx/store';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';

import {FoodItem, FoodComponent, Meal, FoodState, MealEvent, INITIAL_FOODSTATE, MealFoodItem} from './food.interfaces';
import {Injectable} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
// import { CalendarEvent } from 'angular-calendar';


/**
 * FoodActions
 * 
 */
@Injectable()
export class FoodActions {
  
  static DEFAULT_COLOR = { primary: 'black', secondary: 'black' };
    
  /*
   * Action types
   */
  static FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
  static FOOD_COMPONENTS_RECEIVED = 'FOOD_COMPONENTS_RECEIVED';
  static FOOD_COMPONENT_SELECTED = 'FOOD_COMPONENT_SELECTED';
  static MEALS_RECEIVED = 'MEALS_RECEIVED';
  static MEAL_EVENTS_RECEIVED = 'MEAL_EVENTS_RECEIVED';
  static MENU_TIME_ADJUSTED = 'MENU_TIME_ADJUSTED';
  static FOOD_ITEM_UPDATED = 'FOOD_ITEM_UPDATED';
  static FOOD_ITEM_DELETED = 'FOOD_ITEM_DELETED';
  static MEAL_SCHEDULED = 'MEAL_SCHEDULED';
  static MEAL_UPDATED = 'MEAL_UPDATED';
  static MEALFOODITEM_UPDATED = 'MEALFOODITEM_UPDATED';
  static MEALFOODITEMS_RECEIVED = 'MEALFOODITEMS_RECEIVED';
  static MEALFOODITEMS_FOR = 'MEALFOODITEMS_FOR';
  
  static REMOVE_MEALEVENT = 'REMOVE_MEALEVENT';
  
  static SAVE_MEAL = 'SAVE_MEAL'; 
  
  static SAVE_MEALFOODITEM = 'SAVE_MEALFOODITEM';
  
  static SET_CURRENT_MEAL = 'SET_CURRENT_MEAL';
  
  static DELETE_MEALFOODITEM = 'DELETE_MEALFOODITEM';
  
  /*
   * Actions
   */
  mealsReceived = ActionCreatorFactory.create<Meal[]>(FoodActions.MEALS_RECEIVED, FoodActions.setMealsReceived);
  mealEventsReceived = ActionCreatorFactory.create<{start: Date, end: Date, menus: MealEvent[]}>(FoodActions.MEAL_EVENTS_RECEIVED);
  foodItemsReceived = ActionCreatorFactory.create<FoodItem[]>(FoodActions.FOOD_ITEMS_RECEIVED);
  foodComponentsReceived = ActionCreatorFactory.create< FoodComponent[] > (FoodActions.FOOD_COMPONENTS_RECEIVED );  
  foodItemUpdated = ActionCreatorFactory.create<FoodItem>( FoodActions.FOOD_ITEM_UPDATED );    
  foodItemDeleted = ActionCreatorFactory.create<FoodItem>( FoodActions.FOOD_ITEM_DELETED );      
  menuTimeAdjusted = ActionCreatorFactory.create<{start: Date, end: Date}>(FoodActions.MENU_TIME_ADJUSTED);
  
  mealScheduled = ActionCreatorFactory.create<{meal: Meal, date: Date}>( FoodActions.MEAL_SCHEDULED, FoodActions.setMealScheduled );
  
  mealUpdated = ActionCreatorFactory.create<Meal>( FoodActions.MEAL_UPDATED );
  mealFoodItemUpdated = ActionCreatorFactory.create<MealFoodItem>( FoodActions.MEALFOODITEM_UPDATED );
  mealFoodItemsReceived = ActionCreatorFactory.create<MealFoodItem[]>( FoodActions.MEALFOODITEMS_RECEIVED );
  mealFoodItemsFor = ActionCreatorFactory.create<string>( FoodActions.MEALFOODITEMS_FOR );
  deleteMealFoodItem = ActionCreatorFactory.create<string>( FoodActions.DELETE_MEALFOODITEM );
  
  removeMealEvent = ActionCreatorFactory.create<CalendarEvent<Meal>>( FoodActions.REMOVE_MEALEVENT ); 
  
  saveMeal = ActionCreatorFactory.create<Meal>( FoodActions.SAVE_MEAL );
  
  saveMealFoodItem = ActionCreatorFactory
      .create<{ id: string, ageGroup: string, quantity: number, unit: string, mealId: string, foodItemId: string }>( FoodActions.SAVE_MEALFOODITEM ); 
  
  setCurrentMeal = ActionCreatorFactory.create<Meal>( FoodActions.SET_CURRENT_MEAL );
 
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
      case FoodActions.FOOD_COMPONENTS_RECEIVED:
        return FoodActions.setFoodComponentsReceived(state, action);        
      case FoodActions.MEALS_RECEIVED:
        return FoodActions.setMealsReceived(state, action);
      case FoodActions.MEAL_EVENTS_RECEIVED:
        return FoodActions.setMealEventsReceived(state, action);
     case FoodActions.MENU_TIME_ADJUSTED:
        return FoodActions.setMenuTimeAdjusted(state, action);
     case FoodActions.FOOD_ITEM_UPDATED:
        return FoodActions.setFoodItemUpdated( state, action );
     case FoodActions.MEAL_SCHEDULED:
        return FoodActions.setMealScheduled( state, action );     
     case FoodActions.MEAL_UPDATED:
        return FoodActions.setMealUpdated( state, action );
     case FoodActions.SET_CURRENT_MEAL:
        return FoodActions.setCurrentMeal( state, action );   
     case FoodActions.MEALFOODITEMS_RECEIVED:
        return FoodActions.setMealFoodItemsReceived( state, action );
     case FoodActions.REMOVE_MEALEVENT:
        return FoodActions.setRemoveMealEvent( state, action );
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
  static setFoodItemsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             foodItems: action.payload };    
  }
  
  /**
   * Set store data when a meal is scheduled; in response to the FOOD_COMPONENTS_RECEIVED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */  
  static setFoodComponentsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             foodComponents: action.payload };  
  }
  
  /**
   * Set store data when a meal is scheduled; in response to the MEALS_RECEIVED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */  
  static setMealsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             meals: action.payload };  
  }
  
  /**
   * Set store data when a meal is scheduled; in response to the MEAL_EVENTS_RECEIVED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static setMealEventsReceived( state: FoodState, action: Action ) {
   const mealEvents: MealEvent[] = action.payload.menus || [];
     
   const events = mealEvents.map( (mealEvent) => ({ 
     title: mealEvent.meal.description, 
     start: new Date(mealEvent.startDate),
     meta: mealEvent.meal,
     color: FoodActions.DEFAULT_COLOR
   }) );
    
   return { ...state,
            menuUI: { ...state.menuUI, 
                      menus: action.payload.menus, 
                      events: events } }; 
  }
  
  static setRemoveMealEvent( state: FoodState, action: Action ){
    const event = action.payload;
    const events = state.menuUI.events.filter( (e) => e !== event );
    return { ...state,
             menuUI: { ...state.menuUI,
                       events: events }
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
  static setMenuTimeAdjusted( state: FoodState, action: Action ) {
    
    return { ...state, 
             menuUI: { ...state.menuUI, 
                       startMenu: action.payload.start, 
                       endMenu: action.payload.end }};  
  }
  
  /**
   * Set store data when a meal is scheduled; in response to the FOODITEM_UPDATED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static setFoodItemUpdated( state: FoodState, action: Action ) {
    const foodItem = action.payload;
    const idxFoodItem = state.foodItems.findIndex( (fi: FoodItem ) => fi.id === foodItem.id );
    const foodItems = state.foodItems.filter( (fi: FoodItem) => fi.id !== foodItem.id );
    foodItems.splice( idxFoodItem, 0, foodItem );                
    return { ...state, 
             foodItems: foodItems };
  }
  
  
  /**
   * Set store data when a meal is scheduled; in response to the MEAL_UPDATED action
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static setMealUpdated( state: FoodState, action: Action ): FoodState {
    const meal = action.payload;    
    
    const meals = state.meals.filter( (m) => m.id !== meal.id );
    meals.push( meal );
        
    return { ...state, 
             meals: meals, 
             menuUI: { 
               ...state.menuUI, 
               currentMeal: meal 
             } 
           }; 
  }
  
  static setMealFoodItemsReceived( state: FoodState, action: Action ): FoodState {
    const mealFoodItems = action.payload;
    
    // TODO: add to the mealFoodItems array, don't replace/destroy it...
    return { ...state, 
             menuUI: { 
               ...state.menuUI, 
               currentMealFoodItems: mealFoodItems
             } 
           };     
  }
  
  /**
   * Set store data when a meal is selected; in response to the SET_CURRENT_MEAL action
   *  action payload is a Meal
   * 
   * @param {FoodState} state current food state (immutable)
   * @param {Action} action action that triggered the event
   * 
   * @return {FoodState} next state
   */
  static setCurrentMeal( state: FoodState, action: Action ): FoodState {
    const meal = action.payload;
    
    return { ...state,
             menuUI: {
               ...state.menuUI,
               currentMeal: meal
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
  static setMealScheduled( state: FoodState, action: Action ) {
    const { meal, date } = action.payload;
                  
    // get the menu for the date
    const mealEventIdx = state.menuUI.mealEvents.findIndex( (m) => moment(m.startDate).isSame( new Date(date), 'day' ) );
    
    const newMealEvent = ( mealEventIdx < 0 ) ? 
      {
        id: undefined,
        meal: undefined,
        startDate: new Date(date),
        endDate: undefined,
        recurrenceId: undefined
      } : { ...state.menuUI.mealEvents[mealEventIdx] };
    
    const mealEvents = state.menuUI.mealEvents.slice();
        
    if ( mealEventIdx < 0 ) { mealEvents.push( newMealEvent ); } else { mealEvents.splice( mealEventIdx, 0, newMealEvent ); }
                  
    const event = {
      title: meal.description,
      start: new Date(date),
      meta: meal,
      color: FoodActions.DEFAULT_COLOR
    };
    
    const events = state.menuUI.events.slice();    
    events.push( event );
    return { ...state, 
             menuUI: { ...state.menuUI, 
                       events: events } };
  }

}
