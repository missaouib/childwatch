import {MealFoodItem} from './meal-food-item';
import {UUID} from 'angular2-uuid';


export interface Meal {
  id?: string;
  description: string;
  'type': string;
  mealFoodItems?: MealFoodItem[];
  inactive?: boolean;
  compliant?: boolean;
};

export function buildMeal(): Meal {
  return {
    id: UUID.UUID(),
    description: undefined,
    type: undefined,
    mealFoodItems: []
  };
}