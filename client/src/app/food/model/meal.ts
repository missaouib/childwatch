import {MealFoodItem} from './meal-food-item';

export interface Meal {
  id?: string;
  description: string;
  'type': string;
  mealFoodItems?: MealFoodItem[];
  inactive?: boolean;
  compliant?: boolean;
};