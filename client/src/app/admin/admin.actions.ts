 import { FoodItem } from '../meals/meal.interfaces';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import { Page, AdminState, INITIAL_ADMINSTATE } from './admin.interfaces';
import {Injectable} from '@angular/core';
 import { Action } from '@ngrx/store';

@Injectable()
export class AdminActions {
  static FOOD_ITEMS_RECEIVED = '{ADMIN} FOOD_ITEMS_RECEIVED';
  
  foodItemsReceived = ActionCreatorFactory.create< {items: FoodItem[]; page: Page; } >(AdminActions.FOOD_ITEMS_RECEIVED);

  static adminReducer(state: AdminState = INITIAL_ADMINSTATE, action: Action): AdminState {
    switch ( action.type ) {
      case AdminActions.FOOD_ITEMS_RECEIVED:
        return { ...state, foodItems: action.payload };
    }
    return state;
  }


}
