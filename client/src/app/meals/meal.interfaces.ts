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
  units?: string;
  foodItem?: FoodItem;
  _links?: MealFoodItemLinks;
};

export interface MealLinks {
  self: Link;
  meal: Link;
  mealFoodItems: Link;
};

export interface Meal {
  id?: string;
  description: string;
  type: string;
  _links?: MealLinks;
  mealFoodItems: MealFoodItem[];
};

export interface Menu {
  id?: string;
  meal: Meal;
  startDate: Date;
  endDate: Date;
  recurrence: string;
}

export interface MealUIState {
  selectedMenus: Menu[];
  menuStart: Date;
  menuEnd: Date;
  selectedMeal: Meal;
  selectedFoodComponent: FoodComponent;
}

export const INITIAL_MEALUISTATE: MealUIState = {
  selectedMenus: undefined,
  menuStart: undefined,
  menuEnd: undefined,
  selectedMeal: undefined,
  selectedFoodComponent: undefined
};

export interface MealState {
  foodComponents: FoodComponent[];
  meals: Meal[];
  ui: MealUIState;
};

export const INITIAL_MEALSTATE: MealState = {
  foodComponents: [],
  meals: [],
  ui: INITIAL_MEALUISTATE
};

