 import { FoodItem, FoodComponent } from '../meals/meal.interfaces';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import { Page, AdminState, INITIAL_ADMINSTATE } from './admin.interfaces';
import {Injectable} from '@angular/core';
 import { Action } from '@ngrx/store';

@Injectable()
export class AdminActions {
  static FOOD_ITEMS_RECEIVED = '{ADMIN} FOOD_ITEMS_RECEIVED';
  static FOOD_COMPONENTS_RECEIVED = '{ADMIN} FOOD_COMPONENTS_RECEIVED';
  static FOOD_ITEM_UPDATED = '{ADMIN} FOOD_ITEM_UPDATED';
  
  foodItemsReceived = ActionCreatorFactory.create< {items: FoodItem[]; page: Page; } >(AdminActions.FOOD_ITEMS_RECEIVED);
  foodComponentsReceived = ActionCreatorFactory.create< FoodComponent[] > (AdminActions.FOOD_COMPONENTS_RECEIVED );
  
  foodItemUpdated = ActionCreatorFactory.create<FoodItem>( AdminActions.FOOD_ITEM_UPDATED );

  static adminReducer(state: AdminState = INITIAL_ADMINSTATE, action: Action): AdminState {
    switch ( action.type ) {
      case AdminActions.FOOD_ITEMS_RECEIVED:
        return { ...state, foodItems: action.payload };
      case AdminActions.FOOD_COMPONENTS_RECEIVED:
        return { ...state, foodComponents: action.payload };
      case AdminActions.FOOD_ITEM_UPDATED:
        const foodItems = state.foodItems.items.filter( (fi) => fi.id !== action.payload.id );
        foodItems.push( action.payload );
        return { ...state, foodItems: { ...state.foodItems, items: foodItems }  };
    }
    return state;
  }


}
