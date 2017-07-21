import { FoodItem, FoodComponent, Meal } from './meal.interfaces';
import { Action } from '@ngrx/store';


export interface MealState {
  foodItems: FoodItem[];
  foodComponents: FoodComponent[];
  selectedFoodComponent: FoodComponent;
  meals: Meal[];
  selectedMeal: Meal;
};

export const INITIAL_MEALSTATE: MealState = {
  foodItems: [],
  foodComponents: [],
  selectedFoodComponent: undefined,
  meals: [],
  selectedMeal: undefined
};


export const FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
export const FOOD_COMPONENTS_RECEIVED = 'FOOD_COMPONENTS_RECEIVED';
export const FOOD_COMPONENT_SELECTED = 'FOOD_COMPONENT_SELECTED';



export function mealReducer(state: MealState = INITIAL_MEALSTATE, action: Action): MealState {
    switch (action.type) {
      case FOOD_ITEMS_RECEIVED:
        //const { foodComponent, foodItems } = action.payload;
        return { ...state, foodItems: action.payload };
      case FOOD_COMPONENTS_RECEIVED:
        console.log( action.payload );
        return { ...state, foodComponents: action.payload };
      case FOOD_COMPONENT_SELECTED:
        return { ...state, selectedFoodComponent: action.payload };
    }
    return state;
}


export function foodItemsReceived(state: FoodItem[] ): Action {
    return {
      type: FOOD_ITEMS_RECEIVED,
      payload: state
    };
  }

export function foodComponentsReceived( state: FoodComponent[] ): Action {
     return {
      type: FOOD_COMPONENTS_RECEIVED,
      payload: state
     };
  }

export function foodComponentSelected( state: FoodComponent ): Action {
    console.log( 'created action foodComponentSelected' );
    return {
      type: FOOD_COMPONENT_SELECTED,
      payload: state
    };
  }
