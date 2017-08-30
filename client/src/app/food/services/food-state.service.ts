import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent, Meal, MealEvent, MealFoodItem } from '../food.interfaces';
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
  
  addMealFoodItem( meal: Meal, ageGroup: string, foodComponent: FoodComponent ) {
    
    const mealFoodItem: MealFoodItem = {
        ageGroup: ageGroup,
        quantity: 1,
        units: 'each',
        foodItem: {
          description: '',
          shortDescription: '',
          foodComponent: foodComponent,
          purchaseUom: 'each',
          servingUom: 'each',
          notes: 'added'
        } 
      };
    
    this.store.dispatch( this.actions.mealFoodItemAdded( { meal: meal, mealFoodItem: mealFoodItem } ) );
  }
  
  scheduleMeal( meal: Meal, start: Date ) {
    this.store.dispatch( this.actions.mealScheduled( { meal: meal, date: start } ) );
  }
  
  updateMeal( meal: Meal ) {
    this.store.dispatch( this.actions.mealUpdated( meal ) );
  }
}
