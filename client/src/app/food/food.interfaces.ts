import {CalendarEvent} from 'angular-calendar';


export interface FoodItem {
  id: string;
  description: string;
  shortDescription: string;
  purchaseUom: string;
  servingUom: string;
  notes: string;
  tags: FoodItemTag[];

  parent?: FoodItem;
  components?: FoodItem[];
  servingQuantity?: number;
  servingType?: string;
  portionSize?: number;

}

export interface Meal {
  id?: string;
  description: string;
  'type': string;
  mealFoodItems?: MealFoodItem[];
};


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


export interface FoodUIState {
  foodItems: FoodItem[];
  meals: Meal[];
  mealEvents: MealEvent[];
  events: Array<CalendarEvent<MealEvent>>;
  currentMeal: Meal;
  currentMealFoodItems: MealFoodItem[];
  currentAgeGroup: string;
  mealRulesViolations: MealRulesViolation[];
  showWeekends: boolean;
  showBackground: boolean;
};

export const INITIAL_FoodUIState: FoodUIState = {
  foodItems: [],
  meals: [],
  mealEvents: [],
  events: [],
  currentMeal: {
    id: undefined,
    description: undefined,
    type: undefined
  },
  currentMealFoodItems: [],
  currentAgeGroup: 'AGE_0-5MO',
  mealRulesViolations: [],
  showWeekends: false,
  showBackground: false
};



