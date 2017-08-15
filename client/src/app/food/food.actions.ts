import {FoodItem, FoodComponent, Meal, FoodState, Menu, INITIAL_FOODSTATE} from './food.interfaces';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import {Injectable} from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class FoodActions {
  
  /*
   * Action types
   */
  static FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
  static FOOD_COMPONENTS_RECEIVED = 'FOOD_COMPONENTS_RECEIVED';
  static FOOD_COMPONENT_SELECTED = 'FOOD_COMPONENT_SELECTED';
  static MEALS_RECEIVED = 'MEALS_RECEIVED';
  static MENUS_RECEIVED = 'MENUS_RECEIVED';
  static MENU_TIME_ADJUSTED = 'MENU_TIME_ADJUSTED';
  static FOOD_ITEM_UPDATED = 'FOOD_ITEM_UPDATED';
  static FOOD_ITEM_DELETED = 'FOOD_ITEM_DELETED';
  
  
  
  /*
   * Actions
   */
  mealsReceived = ActionCreatorFactory.create<Meal[]>(FoodActions.MEALS_RECEIVED);
  menusReceived = ActionCreatorFactory.create<{start: Date, end: Date, menus: Menu[]}>(FoodActions.MENUS_RECEIVED);
  foodItemsReceived = ActionCreatorFactory.create<FoodItem[]>(FoodActions.FOOD_ITEMS_RECEIVED);
  foodComponentsReceived = ActionCreatorFactory.create< FoodComponent[] > (FoodActions.FOOD_COMPONENTS_RECEIVED );  
  foodItemUpdated = ActionCreatorFactory.create<FoodItem>( FoodActions.FOOD_ITEM_UPDATED );    
  foodItemDeleted = ActionCreatorFactory.create<FoodItem>( FoodActions.FOOD_ITEM_DELETED );      
  menuTimeAdjusted = ActionCreatorFactory.create<{start: Date, end: Date}>(FoodActions.MENU_TIME_ADJUSTED);

 
  static mealReducer(state: FoodState = INITIAL_FOODSTATE, action: Action): FoodState {
    switch (action.type) {
      case FoodActions.FOOD_ITEMS_RECEIVED:
        return { ...state, foodItems: action.payload };
      case FoodActions.FOOD_COMPONENTS_RECEIVED:
        return { ...state, foodComponents: action.payload };
      case FoodActions.MEALS_RECEIVED:
        return { ...state, meals: action.payload };
      case FoodActions.MENUS_RECEIVED:
        return { ...state,
                 menuUI: { ...state.menuUI, menus: action.payload.menus } };
     case FoodActions.MENU_TIME_ADJUSTED:
        return { ...state,
                 menuUI: { ...state.menuUI, startMenu: action.payload.start, endMenu: action.payload.end } };
     case FoodActions.FOOD_ITEM_UPDATED:
        const foodItem = action.payload;
        const idxFoodItem = state.foodItems.findIndex( (fi) => fi.id === foodItem.id );
        const foodItems = state.foodItems.filter( (fi) => fi.id !== foodItem.id );
        foodItems.splice( idxFoodItem, 0, foodItem );                
        return { ...state, foodItems: foodItems };
        
    }
    return state;
  } 


}
