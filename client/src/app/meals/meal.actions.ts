import {FoodItem, FoodComponent, Meal, MealFoodItem, MealState, INITIAL_MEALSTATE, Menu} from './meal.interfaces';
import {ActionCreatorFactory} from '../utils/actioncreatorfactory';
import {Injectable} from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class MealActions {
  
  /*
   * Action types
   */
  static FOOD_ITEMS_RECEIVED = 'FOOD_ITEMS_RECEIVED';
  static FOOD_COMPONENTS_RECEIVED = 'FOOD_COMPONENTS_RECEIVED';
  static FOOD_COMPONENT_SELECTED = 'FOOD_COMPONENT_SELECTED';
  static MEALS_RECEIVED = 'MEALS_RECEIVED';
  static MEAL_SELECTED = 'MEAL_SELECTED';
  static MEAL_FOOD_ITEMS_RECEIVED = 'MEAL_FOOD_ITEMS_RECEIVED';
  static ADD_FOOD_COMPONENT_TO_SELECTED_MEAL = 'ADD_FOOD_COMPONENT_TO_SELECTED_MEAL';
  static ADD_MENU_ITEM = 'ADD_MENU_ITEM';
  static REMOVE_MEAL_FOOD_ITEM_FROM_SELECTED_MEAL = 'REMOVE_MEAL_FOOD_ITEM_FROM_SELECTED_MEAL';
  static MENUS_RECEIVED = 'MENUS_RECEIVED';
  static MENU_TIME_ADJUSTED = 'MENU_TIME_ADJUSTED';
  
  
  /*
   * Actions
   */
  mealsReceived = ActionCreatorFactory.create<Meal[]>(MealActions.MEALS_RECEIVED);
  menusReceived = ActionCreatorFactory.create<{start: Date, end: Date, menus: Menu[]}>(MealActions.MENUS_RECEIVED);
  foodItemsReceived = ActionCreatorFactory.create<{foodComponent: FoodComponent, foodItems: FoodItem[]}>(MealActions.FOOD_ITEMS_RECEIVED);
  foodComponentsReceived = ActionCreatorFactory.create<FoodComponent[]>(MealActions.FOOD_COMPONENTS_RECEIVED);
  foodComponentSelected = ActionCreatorFactory.create<FoodComponent>(MealActions.FOOD_COMPONENT_SELECTED);
  mealSelected = ActionCreatorFactory.create<Meal>(MealActions.MEAL_SELECTED);
  mealFoodItemsReceived = ActionCreatorFactory.create<MealFoodItem[]>(MealActions.MEAL_FOOD_ITEMS_RECEIVED);
  addFoodComponentToSelectedMeal = ActionCreatorFactory.create<FoodComponent>(MealActions.ADD_FOOD_COMPONENT_TO_SELECTED_MEAL);
  removeMealFoodItemFromSelectedMeal = ActionCreatorFactory.create<MealFoodItem>(MealActions.REMOVE_MEAL_FOOD_ITEM_FROM_SELECTED_MEAL );
  menuTimeAdjusted = ActionCreatorFactory.create<{start: Date, end: Date}>(MealActions.MENU_TIME_ADJUSTED);

  addMenuItem = ActionCreatorFactory.create<{type: string}>(MealActions.ADD_MENU_ITEM);

  static mealReducer(state: MealState = INITIAL_MEALSTATE, action: Action): MealState {
    switch (action.type) {
      case MealActions.FOOD_ITEMS_RECEIVED:
        const { foodComponent, foodItems } = action.payload;
        const fc = { ...foodComponent, foodItems: foodItems };
        return { ...state, ui: { ...state.ui, selectedFoodComponent: fc } };
      case MealActions.FOOD_COMPONENTS_RECEIVED:
        console.log( action.payload );
        return { ...state, foodComponents: action.payload };
      case MealActions.FOOD_COMPONENT_SELECTED:
        return { ...state, ui: { ...state.ui, selectedFoodComponent: action.payload } };
      case MealActions.MEALS_RECEIVED:
        return { ...state, meals: action.payload };
      case MealActions.MEAL_SELECTED:
        // TODO: put the previous selected meal back in the meal list (save intermediate results)
        return { ...state, ui: { ...state.ui, selectedMeal: action.payload } };
      case MealActions.MEAL_FOOD_ITEMS_RECEIVED:
        console.log( action.payload );
        return { ...state, ui: { ...state.ui, selectedMeal: { ...state.ui.selectedMeal, mealFoodItems: action.payload } } };
      case MealActions.ADD_FOOD_COMPONENT_TO_SELECTED_MEAL:
        const mealFoodItem: MealFoodItem = {
          id: undefined,
          ageGroup: undefined,
          quantity: 1,
          foodItem: { id: undefined, description: undefined, shortDescription: undefined, foodComponent: action.payload, notes: undefined, purchaseUom: undefined, servingUom: undefined }
        };
        const mealFoodItems =  state.ui.selectedMeal.mealFoodItems.concat( mealFoodItem );
        return { ...state, ui: { ...state.ui, selectedMeal: { ...state.ui.selectedMeal, mealFoodItems: mealFoodItems } } };
      case MealActions.ADD_MENU_ITEM:
        const meal: Meal = {
            description: 'New Meal (' + action.payload.type + ')',
            type: action.payload.type,
            mealFoodItems: undefined
        };
        const meals = state.meals.concat( meal );
        return { ...state, meals: meals };
      case MealActions.REMOVE_MEAL_FOOD_ITEM_FROM_SELECTED_MEAL:
        const items = state.ui.selectedMeal.mealFoodItems.filter( item => item !== action.payload );
        return { ...state, ui: { ...state.ui, selectedMeal: { ...state.ui.selectedMeal, mealFoodItems: items } } };
      case MealActions.MENUS_RECEIVED:
        return { ...state,
                 ui: { ...state.ui, selectedMenus: action.payload.menus } };
     case MealActions.MENU_TIME_ADJUSTED:
        return { ...state,
                 ui: { ...state.ui, startMenu: action.payload.start, endMenu: action.payload.end } };
    }
    return state;
}


}
