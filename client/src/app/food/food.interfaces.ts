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
  inactive?: boolean;
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





