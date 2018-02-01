import {FoodItem} from './food-item';
import {FoodItemUtils} from "./food-item-utils";
import {Meal} from './meal';

export interface MealFoodItem {
  id: string;
  ageGroup: string;
  quantity?: number;
  unit?: string;
  meal: Meal;
  foodItem: FoodItem;
  hasErrors?: boolean;
};

/**
 * Compare 2 meal food items for 'sort order'
 * 
 * @param a {MealFoodItem} food item #1
 * @param b {MealFoodItem} food item #2
 * @returns -1; 0 ; 1
 */
export function compareMealFoodItems(a: MealFoodItem, b: MealFoodItem): number {
  const Utils: FoodItemUtils = new FoodItemUtils();
  var catA = Utils.category(a.foodItem);
  var catB = Utils.category(b.foodItem);
  const categories = ['MILK', 'CNITEM', 'MEAT', 'VEGETABLE', 'FRUIT', 'GRAIN', 'OTHER'];
  var val = categories.indexOf(catA) - categories.indexOf(catB);
  return val === 0 ? a.foodItem.description.localeCompare(b.foodItem.description) : val;
}