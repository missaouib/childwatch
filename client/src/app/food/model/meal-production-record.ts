import {FoodItem} from './food-item';
import {Meal} from './meal';

export interface MealProductionFoodItem {
  id: string,
  mpr?: MealProductionRecord,
  foodItem: FoodItem,
  required: number,
  prepared: number,
  unit: string
}

export interface MealAttendanceRecord {
  id: string,
  mpr?: MealProductionRecord,
  ageGroup: string,
  projected: number,
  actual: number
}

export interface MealProductionRecord {
  id: string,
  mealDate: Date,
  type: string,
  locked?: boolean,
  lockDate?: Date,
  meal?: Meal,
  notes: string,
  mealAttendanceRecords?: MealAttendanceRecord[],
  mealProductionFoodItems?: MealProductionFoodItem[]
}