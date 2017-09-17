import { AppState } from '../../app.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FoodItem, FoodComponent, Meal, MealEvent, MealFoodItem } from '../food.interfaces';
import { FoodActions } from '../food.actions';
import { CalendarEvent } from 'angular-calendar';
import { UUID } from 'angular2-uuid';


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
  
  get mealEvents$(): Observable<Array<CalendarEvent<MealEvent>>>{
    return this.store.select( s => s.food.menuUI.events );
  }
  
  get currentMealFoodItems$(): Observable<MealFoodItem[]> {
    return this.store.select( s => s.food.menuUI.currentMealFoodItems );
  }

  adjustMenuTime( start: Date, end: Date ) {
    this.store.dispatch( this.actions.menuTimeAdjusted( { start: start, end: end } ) );
  }
  
  get currentMeal$(): Observable<Meal>{
    return this.store.select( s => s.food.menuUI.currentMeal );
  }
    
  scheduleMeal( meal: Meal, start: Date ) {
    console.log( 'Scheduling new meal ' + meal.description + ' for ' + start );
    this.store.dispatch( this.actions.mealScheduled( { meal: meal, date: start } ) );
  }
    
  get mealRuleViolations$(){
    return this.store.select( s => s.food.menuUI.mealRulesViolations );
  }
  
    
  saveMeal( meal: Meal ) {    
    const mealToSave = { ...meal };
    if( mealToSave.id === undefined )
      mealToSave.id = UUID.UUID();
    this.store.dispatch( this.actions.saveMeal( meal ) );
  }
  
  loadMealFoodItemsForMeal( meal: Meal ) {
    this.store.dispatch( this.actions.loadMealFoodItemsForMeal(meal) );
  }
  
  deleteMealFoodItem( mealFoodItem: MealFoodItem ) {
    this.store.dispatch( this.actions.deleteMealFoodItem( mealFoodItem ) );
  }
  
  saveMealFoodItem( mealFoodItem: MealFoodItem ) {
    this.store.dispatch( this.actions.saveMealFoodItem( mealFoodItem ) );
  }
  removeEvent( event: CalendarEvent<MealEvent> ) {
    this.store.dispatch( this.actions.removeMealEvent( event ) );
  }
   
}
