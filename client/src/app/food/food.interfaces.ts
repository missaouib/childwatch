import {FoodItem} from './model/food-item';
import {CalendarEvent} from 'angular-calendar';


export interface Meal {
  id?: string;
  description: string;
  'type': string;
  mealFoodItems?: MealFoodItem[];
};

export interface Link {
  href: string;
}

export interface FoodItemTag {
  value: string;
}


export interface MealFoodItem {
  id: string;
  ageGroup: string;
  quantity?: number;
  unit?: string;
  meal: Meal;
  foodItem: FoodItem;
};


export interface MealEvent {
  id?: string;
  meal: Meal;
  startDate: Date;
  endDate: Date;
  recurrence: string;
}

export interface Rule {
  name: string;
}

export interface MealRulesViolation {
  severity: string;
  message: string;
  rule: Rule;
  mealId: string;
  ageGroup?: string;
};


export interface MenuUIState {
  mealEvents: MealEvent[];
  events: Array<CalendarEvent<MealEvent>>;
  currentMeal: Meal;
  currentMealFoodItems: MealFoodItem[];
  currentAgeGroup: string;
  mealRulesViolations: MealRulesViolation[];
}

export const INITIAL_MEALSTATE: Meal = {
  id: undefined,
  description: undefined,
  type: undefined
};

export const INITIAL_MENUUISTATE: MenuUIState = {
  mealEvents: [],
  events: [],
  currentMeal: {
    id: undefined,
    description: undefined,
    type: undefined
  },
  currentMealFoodItems: [],
  currentAgeGroup: 'AGE_0-5MO',
  mealRulesViolations: []
};

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
};

export interface FoodState {
  foodItems: FoodItem[];
  meals: Meal[];
  menuUI: MenuUIState;
};

export const INITIAL_FOODSTATE: FoodState = {
  foodItems: [],
  meals: [],
  menuUI: INITIAL_MENUUISTATE
};

export interface IData {
  label: string;
  value: number;
};


