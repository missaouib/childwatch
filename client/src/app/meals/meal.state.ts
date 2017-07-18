import { Action } from '@ngrx/store';
import { Food } from './meal.interfaces';

export interface MealState {
  foods: Food[];
}


export const WATCH_MEAL_STATIC_DATA = 'WATCH_MEAL_STATIC_DATA';
export function watchMealStaticData(): Action { return { type: WATCH_MEAL_STATIC_DATA }; }

export const STATIC_MEAL_DATA_RECEIVED = 'STATIC_MEAL_DATA_RECEIVED';
export function staticMealDataReceived(state: MealState ): Action {
  console.log( 'smdr' );
  return {
    type: STATIC_MEAL_DATA_RECEIVED,
    payload: state
  };
}

export function mealReducer(state: MealState = { foods: [] }, action: Action): MealState {
  switch (action.type) {
    case STATIC_MEAL_DATA_RECEIVED:
      console.log( 'FOOD = ' + action.payload  );
      const { foods } = action.payload;
      return {...state, foods };
  }
  return state;
}
