import {AppState} from '../../app.state';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as FoodActions from '../store/food.actions';
import {FoodItem} from '../model/food-item';
import {Meal} from '../model/meal';
import {MealEvent} from '../model/meal-event';
import {MealFoodItem} from '../model/meal-food-item';
import {CalendarEvent} from 'angular-calendar';


@Injectable()
export class FoodStateService {

  constructor(
    private store: Store<AppState>) {}

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
    this.store.dispatch(new FoodActions.MenuTimeAdjustedAction({start: start, end: end}));
  }

  get currentMeal$(): Observable<Meal> {
    return this.store.select(s => s.food.currentMeal);
  }

  scheduleMealEvent(mealEvent: MealEvent) {
    this.store.dispatch(new FoodActions.MealEventScheduledAction(mealEvent));
  }

  get mealRuleViolations$() {
    return this.store.select(s => s.food.mealRulesViolations);
  }


  saveMeal(meal: Meal) {
    if (meal.id) {
      this.store.dispatch(new FoodActions.SaveMealAction(meal));
    }
  }

  loadMealFoodItemsForMeal(meal: Meal) {
    this.store.dispatch(new FoodActions.LoadMealFoodItemsForMealAction(meal));
  }

  deleteMealFoodItem(mealFoodItem: MealFoodItem) {
    this.store.dispatch(new FoodActions.DeleteMealFoodItemAction(mealFoodItem));
  }

  saveMealFoodItem(mealFoodItem: MealFoodItem) {
    this.store.dispatch(new FoodActions.SaveMealFoodItemAction(mealFoodItem));
  }

  removeEvent(event: CalendarEvent<MealEvent>) {
    this.store.dispatch(new FoodActions.RemoveMealEventAction(event.meta));
  }


  inactivateMeal(meal: Meal) {
    var m = Object.assign({}, meal);
    m.inactive = true;
    this.store.dispatch(new FoodActions.InactivateMealAction(m));
  }

  updateFoodItem(foodItem: FoodItem) {
    if (foodItem)
      this.store.dispatch(new FoodActions.FoodItemUpdatedAction(foodItem));
  }

}
