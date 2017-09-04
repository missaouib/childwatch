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
  
  get currentMealFoodItems$(): Observable<MealFoodItem[]> {
    return this.store.select( s => s.food.menuUI.currentMealFoodItems );
  }

  adjustMenuTime( start: Date, end: Date ) {
    this.store.dispatch( this.actions.menuTimeAdjusted( { start: start, end: end } ) );
  }
  
  get currentMeal$(): Observable<Meal>{
    return this.store.select( s => s.food.menuUI.currentMeal );
  }
  
  set currentMeal$( meal: Observable<Meal> ) {
    meal.subscribe( (m) => this.store.dispatch( this.actions.setCurrentMeal( m ) ) );
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
      id: $event.mealFoodItemId,
      ageGroup: ageGroup,       
      quantity: Number.parseInt($event.quantity as string),
      unit: $event.unit, 
      mealId: meal.id, 
      foodItemId: $event.foodItemId 
     };
    
    this.store.dispatch( this.actions.saveMealFoodItem(mealFoodItem) );  
  }
  
  mealFoodItemsFor( mealId : string ) {
    this.store.dispatch( this.actions.mealFoodItemsFor( mealId ) );
  }
  
  deleteMealFoodItem( mealFoodItemId: string ){
    console.log( 'Deleting ' + mealFoodItemId );
    this.store.dispatch( this.actions.deleteMealFoodItem( mealFoodItemId ) );
  }
  
  removeEvent( event: CalendarEvent<Meal> ) {
    this.store.dispatch( this.actions.removeMealEvent( event ) );
  }
}
