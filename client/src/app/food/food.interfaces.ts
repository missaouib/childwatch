import { CalendarEvent } from 'angular-calendar';

export interface Meal {
  id?: string;
  description: string;
  'type': string;
  _links?: MealLinks;
  mealFoodItems?: MealFoodItem[];
};

export interface Link {
  href: string;
}

export interface FoodItem {
  id?: string;
  description?: string;
  shortDescription?: string;
  foodComponent: FoodComponent;
  purchaseUom: string;
  servingUom: string;
  notes: string;
};

export interface FoodComponentLinks {
  self: Link;
  foodItems: Link;
};

export interface FoodComponent {
  id: string;
  description: string;
  _links?: FoodComponentLinks;
  foodItems?: FoodItem[];
  parentComponent: FoodComponent;
};

export interface MealFoodItemLinks {
  self: Link;
  foodItem: Link;
  meal: Link;
};

export interface MealFoodItem {
  id?: string;
  ageGroup?: string;
  quantity?: number;
  unit?: string;
  meal?: Meal;
  foodComponent?: FoodComponent;
  foodItem?: FoodItem;
};

export interface MealLinks {
  self: Link;
  meal: Link;
  mealFoodItems: Link;
};


export interface MealEvent {
  id?: string;
  meal: Meal;
  startDate: Date;
  endDate: Date;
  recurrenceId: string;
}

export interface MealRulesViolation {
  severity: string;
  message: string;
  rule: {
    name: string
  };
  mealId: string;
};


export interface MenuUIState {
  menuStart: Date;
  menuEnd: Date;
  mealEvents: MealEvent[];
  events: Array<CalendarEvent<Meal>>;
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
  menuStart: undefined,
  menuEnd: undefined,
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
  foodComponents: FoodComponent[];
  meals: Meal[];
  menuUI: MenuUIState;
};

export const INITIAL_FOODSTATE: FoodState = {
  foodItems: [],
  foodComponents: [],
  meals: [],
  menuUI: INITIAL_MENUUISTATE
};

export interface IData {
    label: string;
    value: number;
};


