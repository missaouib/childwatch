import {FoodItem} from './food-item';

export interface AttendanceRecord {
  planned: number,
  actual: number
}

export interface ProductionFoodItem {
  foodItem: FoodItem,
  required: number,
  prepared: number,
  units: string
}

export interface AttendanceRecordSet {
  AGE_0_5MO?: AttendanceRecord,
  AGE_6_11MO?: AttendanceRecord,
  AGE_1YR?: AttendanceRecord,
  AGE_2YR?: AttendanceRecord,
  AGE_3_5YR?: AttendanceRecord,
  AGE_6_12YR?: AttendanceRecord,
  AGE_13_18YR?: AttendanceRecord,
  AGE_ADULT?: AttendanceRecord,
  NON_PARTICIPANT?: AttendanceRecord
}

export interface MealProductionRecord {
  mealDate: Date,
  locked: boolean,

  breakfast?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  },

  am_snack?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  },

  lunch?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  },

  pm_snack?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  },

  dinner?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  },

  evening_snack?: {
    foodItems: ProductionFoodItem[],
    attendance: AttendanceRecordSet,
    notes?: string
  }

}