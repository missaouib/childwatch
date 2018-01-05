import {Meal} from './meal';

export interface MealEvent {
  id?: string;
  meal: Meal;
  startDate: Date;
  endDate: Date;
  recurrence: string;
  masterEvent?: MealEvent;
}