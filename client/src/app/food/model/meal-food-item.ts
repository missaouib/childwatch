import {FoodItem} from './food-item';
import {Meal} from './meal';

export interface MealFoodItem {
  id: string;
  ageGroup: string;
  quantity?: number;
  unit?: string;
  meal: Meal;
  foodItem: FoodItem;
};