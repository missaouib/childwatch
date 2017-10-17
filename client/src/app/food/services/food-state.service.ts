import {AppState} from '../../app.state';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Meal, MealEvent, MealFoodItem, FoodItem} from '../food.interfaces';
import {FoodActions} from '../food.actions';
import {CalendarEvent} from 'angular-calendar';


@Injectable()
export class FoodStateService {

  constructor(
    private store: Store<AppState>,
    private actions: FoodActions) {}

  get foodItems$(): Observable<FoodItem[]> {
    return this.store.select(s => s.food.foodItems);
  }

  get menus$(): Observable<MealEvent[]> {
    return this.store.select(s => s.food.mealEvents);
  }

  get meals$(): Observable<Meal[]> {
    return this.store.select(s => s.food.meals);
  }

  get mealEvents$(): Observable<Array<CalendarEvent<MealEvent>>> {
    return this.store.select(s => s.food.events);
  }

  get currentMealFoodItems$(): Observable<MealFoodItem[]> {
    return this.store.select(s => s.food.currentMealFoodItems);
  }

  adjustMenuTime(start: Date, end: Date) {
    this.store.dispatch(this.actions.menuTimeAdjusted({start: start, end: end}));
  }

  get currentMeal$(): Observable<Meal> {
    return this.store.select(s => s.food.currentMeal);
  }

  scheduleMealEvent(mealEvent: MealEvent) {
    this.store.dispatch(this.actions.mealEventScheduled(mealEvent));
  }

  get mealRuleViolations$() {
    return this.store.select(s => s.food.mealRulesViolations);
  }


  saveMeal(meal: Meal) {
    if (meal.id) {
      this.store.dispatch(this.actions.saveMeal(meal));
    }
  }

  loadMealFoodItemsForMeal(meal: Meal) {
    this.store.dispatch(this.actions.loadMealFoodItemsForMeal(meal));
  }

  deleteMealFoodItem(mealFoodItem: MealFoodItem) {
    this.store.dispatch(this.actions.deleteMealFoodItem(mealFoodItem));
  }

  saveMealFoodItem(mealFoodItem: MealFoodItem) {
    this.store.dispatch(this.actions.saveMealFoodItem(mealFoodItem));
  }

  removeEvent(event: CalendarEvent<MealEvent>) {
    this.store.dispatch(this.actions.removeMealEvent(event));
  }

  get canShowWeekends() {
    return this.store.select(s => s.food.showWeekends);
  }

  showWeekends(show: boolean) {
    this.store.dispatch(this.actions.showWeekends(show));
  }

  get canShowBackground() {
    return this.store.select(s => s.food.showBackground);
  }

  showBackground(show: boolean) {
    this.store.dispatch(this.actions.showBackground(show));
  }

}
