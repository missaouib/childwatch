import {FoodItem} from './food-item';
import {MealEvent} from './meal-event';

export interface MealProductionFoodItem {
  id: string,
  mpr?: MealProductionRecord,
  foodItem: FoodItem,
  required: number,
  calcRequired?: number,
  prepared: number,
  uom: string
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
  mealEvent?: MealEvent,
  notes: string,
  attendanceRecords?: MealAttendanceRecord[],
  productionFoodItems?: MealProductionFoodItem[]
}