import { FoodItem } from '../meals/meal.interfaces';

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
};

export interface AdminState {
  foodItems: {
    items: FoodItem[];
    page: Page;
  };
};

export const INITIAL_ADMINSTATE: AdminState = {
  foodItems: {
    items: undefined,
    page: {
      size: 0,
      totalElements: 0,
      totalPages: 0,
      number: 0
    }
  }
};
