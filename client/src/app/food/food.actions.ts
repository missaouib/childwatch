import {FoodItem, FoodComponent, Meal, FoodState, MealEvent, INITIAL_FOODSTATE, MealFoodItem} from './food.interfaces';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import {Injectable} from '@angular/core';
import { Action } from '@ngrx/store';
// import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';

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
  static MEAL_FOOD_ITEM_ADDED = 'MEAL_FOOD_ITEM_ADDED';
  static MEAL_SCHEDULED = 'MEAL_SCHEDULED';
  
  
  
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

  mealFoodItemAdded = ActionCreatorFactory.create<{meal: Meal, mealFoodItem: MealFoodItem}>(FoodActions.MEAL_FOOD_ITEM_ADDED);
  
  mealScheduled = ActionCreatorFactory.create<{meal: Meal, date: Date}>( FoodActions.MEAL_SCHEDULED, FoodActions.setMealScheduled );
 
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
     case FoodActions.MEAL_FOOD_ITEM_ADDED:
        return FoodActions.setMealFoodItemAdded( state, action );
     case FoodActions.MEAL_SCHEDULED:
        return FoodActions.setMealScheduled( state, action );        
    }
    return state;
  } 
  
  static setFoodItemsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             foodItems: action.payload };    
  }
  
  static setFoodComponentsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             foodComponents: action.payload };  
  }
  
  static setMealsReceived( state: FoodState, action: Action ) {
    return { ...state, 
             meals: action.payload };  
  }
  
  static setMealEventsReceived( state: FoodState, action: Action ) {
   const mealEvents: MealEvent[] = action.payload.menus;
     
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
  
  static setMenuTimeAdjusted( state: FoodState, action: Action ) {
    return { ...state, 
             menuUI: { ...state.menuUI, 
                       startMenu: action.payload.start, 
                       endMenu: action.payload.end }};  
  }
  
  static setFoodItemUpdated( state: FoodState, action: Action ) {
    const foodItem = action.payload;
    const idxFoodItem = state.foodItems.findIndex( (fi: FoodItem ) => fi.id === foodItem.id );
    const foodItems = state.foodItems.filter( (fi: FoodItem) => fi.id !== foodItem.id );
    foodItems.splice( idxFoodItem, 0, foodItem );                
    return { ...state, 
             foodItems: foodItems };
  }
  
  static setMealFoodItemAdded( state: FoodState, action: Action ) {
    const menuIdx = state.menuUI.mealEvents
      .findIndex( (mealEvent) => mealEvent.meal && mealEvent.meal.id === action.payload.meal.id );        
    const newMenu = { ...state.menuUI.mealEvents[menuIdx] };
    newMenu.meal.mealFoodItems.push( action.payload.mealFoodItem );        
    const menus = { ...state.menuUI.mealEvents };
    menus.splice( menuIdx, 0, newMenu );
    return { ...state, 
             menuUI: { ...state.menuUI,  
                       menus:  menus } };
  }
  
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
    
    const mealEvents = { ...state.menuUI.mealEvents };
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
