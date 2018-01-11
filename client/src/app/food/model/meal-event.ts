import {Meal} from './meal';
import {CalendarEvent} from "angular-calendar";
import * as moment from 'moment';
import {UUID} from 'angular2-uuid';


export interface MealEvent {
  id?: string;
  meal: Meal;
  startDate: Date;
  endDate: Date;
  recurrence: string;
  masterEvent?: MealEvent;
}

export function compareEvent(a: CalendarEvent<MealEvent>, b: CalendarEvent<MealEvent>): number {
  const MEALS = ['BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER'];
  return MEALS.indexOf(a.meta.meal.type) - MEALS.indexOf(b.meta.meal.type);
}

export function buildMealEvent(meal: Meal, start?: Date): MealEvent {
  return {
    id: UUID.UUID(),
    startDate: moment((start) ? moment(start) : new Date()).toDate(),
    endDate: moment((start) ? moment(start) : new Date()).toDate(),
    recurrence: undefined,
    meal: meal
  };
}