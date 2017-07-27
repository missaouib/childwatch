export interface Link {
  href: string;
}

export interface FoodItem {
  id: string;
  description: string;
  shortDescription: string;
  foodComponent: FoodComponent;
};

export interface FoodComponentLinks {
  self: Link;
  foodItems: Link;
};

export interface FoodComponent {
  id: string;
  description: string;
  _links?: FoodComponentLinks;
  foodItems: FoodItem[];
};

export interface MealFoodItemLinks {
  self: Link;
  foodItem: Link;
  meal: Link;
};

export interface MealFoodItem {
  id: string;
  ageGroup: string;
  amount: number;
  foodItem: FoodItem;
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

