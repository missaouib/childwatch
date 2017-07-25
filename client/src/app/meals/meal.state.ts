import { FoodItem, FoodComponent, Meal } from './meal.interfaces';
import { Action } from '@ngrx/store';

export interface MealUIState {
  selectedMeal: Meal;
  selectedFoodComponent: FoodComponent;
}

export const INITIAL_MEALUISTATE: MealUIState = {
  selectedMeal: undefined,
  selectedFoodComponent: undefined
};

export interface MealState {
  foodComponents: FoodComponent[];
  meals: Meal[];
  ui: MealUIState;
};

export const INITIAL_MEALSTATE: MealState = {
  foodComponents: [],
  meals: [],
  ui: INITIAL_MEALUISTATE
};


export const FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
export const FOOD_COMPONENTS_RECEIVED = 'FOOD_COMPONENTS_RECEIVED';
export const FOOD_COMPONENT_SELECTED = 'FOOD_COMPONENT_SELECTED';
export const MEALS_RECEIVED = 'MEALS_RECEIVED';
export const MEAL_SELECTED = 'MEAL_SELECTED';



export function mealReducer(state: MealState = INITIAL_MEALSTATE, action: Action): MealState {
    switch (action.type) {
      case FOOD_ITEMS_RECEIVED:
        const { foodComponent, foodItems } = action.payload;
        const fc = { ...foodComponent, foodItems: foodItems };
        return { ...state, ui: { ...state.ui, selectedFoodComponent: fc } };
      case FOOD_COMPONENTS_RECEIVED:
        console.log( action.payload );
        return { ...state, foodComponents: action.payload };
      case FOOD_COMPONENT_SELECTED:
        return { ...state, ui: { ...state.ui, selectedFoodComponent: action.payload } };
      case MEALS_RECEIVED:
        return { ...state, meals: action.payload };
      case MEAL_SELECTED:
        return { ...state, ui: { ...state.ui, selectedMeal: action.payload } };
    }
    return state;
}


export function mealsReceived( state: Meal[] ): Action {
  return {
    type: MEALS_RECEIVED,
    payload: state
  };
}

export function foodItemsReceived(state: { foodComponent: FoodComponent, foodItems: FoodItem[] } ): Action {
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

export function mealSelected( state: Meal ): Action {
  return {
    type: MEAL_SELECTED,
    payload: state
  };
}
