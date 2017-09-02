import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent, Meal, MealEvent } from '../food.interfaces';
import { FoodActions } from '../food.actions';
import { CalendarEvent } from 'angular-calendar';



@Injectable()
export class FoodStateService {

  constructor(
    private store: Store<AppState>,
    private actions: FoodActions ) {}

  get foodItems$(): Observable<FoodItem[]> {
      return this.store.select( s => s.food.foodItems );
  }

  get foodComponents$(): Observable<FoodComponent[]> {
    return this.store.select( s => s.food.foodComponents );
  }

  get menus$(): Observable<MealEvent[]>{
    return this.store.select( s => s.food.menuUI.mealEvents );
  }

  get meals$(): Observable<Meal[]>{
    return this.store.select( s => s.food.meals );
  }
  
  get mealEvents$(): Observable<Array<CalendarEvent<Meal>>>{
    return this.store.select( s => s.food.menuUI.events );
  }

  adjustMenuTime( start: Date, end: Date ) {
    this.store.dispatch( this.actions.menuTimeAdjusted( { start: start, end: end } ) );
  }
  
  get currentMeal$(): Observable<Meal>{
    return this.store.select( s => s.food.menuUI.currentMeal );
  }
  
  scheduleMeal( meal: Meal, start: Date ) {
    this.store.dispatch( this.actions.mealScheduled( { meal: meal, date: start } ) );
  }
  
  updateMeal( meal: Meal ) {
    this.store.dispatch( this.actions.saveMeal( meal ) );
  }
  
  /**
   * Update the meal food item for the given meal
   */
  updateMealFoodItem( $event: any, ageGroup: string, meal: Meal ) {
    console.log( $event, meal );
    
    const mealFoodItem = {      
      id: 'NEW_ID',
      ageGroup: ageGroup,       
      quantity: Number.parseInt($event.quantity as string),
      unit: $event.unit, 
      mealId: meal.id, 
      foodItemId: $event.foodItemId 
     };
    
    this.store.dispatch( this.actions.saveMealFoodItem(mealFoodItem) );  
  }
}
