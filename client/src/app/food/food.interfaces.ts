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

export interface MenuUIState {
  menuStart: Date;
  menuEnd: Date;
  menus: Menu[];
}

export const INITIAL_MENUUISTATE: MenuUIState = {
  menuStart: undefined,
  menuEnd: undefined,
  menus: []
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

