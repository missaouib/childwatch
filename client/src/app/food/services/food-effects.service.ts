/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { FoodActions } from '../food.actions';
import { Meal, MealFoodItem } from '../food.interfaces';
import { MealEventService } from './meal-event.service';
import { MealService } from './meal.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


/**
 * FoodEffectsService
 * 
 * @service
 */
@Injectable()
export class FoodEffectsService {

  /**
   * adjustedMenuTime
   * 
   * @redux-effect
   */
  @Effect() adjustedMenuTime = this.actions$
    .ofType( FoodActions.MENU_TIME_ADJUSTED )
    .map( toPayload )
    .switchMap( payload => {
        this.mealEventSvc.queryBetween( payload.start, payload.end ).subscribe();
        return Observable.of( {type: 'MEALS_QUERY' } );
  });
  
  /**
   * Side effect when a meal is updated; saves the meal to the database
   * 
   * @redux-effect
   */
  @Effect() _onSaveMeal = this.actions$
    .ofType( FoodActions.SAVE_MEAL )
    .map( toPayload )
    .switchMap( (payload: Meal) => Observable.of( this.onSaveMeal(payload) ) );
  
  @Effect() _onLoadMealFoodItemsForMeal = this.actions$
    .ofType( FoodActions.LOAD_MEALFOODITEMS_FOR_MEAL )
    .map( toPayload )
    .switchMap( (payload: Meal) => this.onLoadMealFoodItemsForMeal( payload ) );
  
   
  @Effect() _onMealFoodItemReceived = this.actions$
    .ofType( FoodActions.MEALFOODITEMS_RECEIVED )
    .map( toPayload )
    .switchMap( (payload: MealFoodItem[]) => this.onMealFoodItemsReceived(payload) );
  
  /**
   * Side effect of when a mealfooditem is requested to be saved; save to the database
   * @redux-effect
   */
  @Effect() _onSaveMealFoodItem = this.actions$
    .ofType( FoodActions.SAVE_MEALFOODITEM )
    .map( toPayload )
    .switchMap( (payload: MealFoodItem) => this.onSaveMealFoodItem(payload) );
    
  
  @Effect() _onDeleteMealFoodItem = this.actions$
    .ofType( FoodActions.DELETE_MEALFOODITEM )
    .map( toPayload )
    .switchMap( (payload: MealFoodItem) => this.onDeleteMealFoodItem(payload) );
          
    
  disablePersist: boolean;
  
  /**
   * Constructor for the FoodEffectsService
   * 
   * @constructor
   * 
   * @param actions$ - Injected
   * @param mealEventSvc - Injected
   * @param mealSvc - Injected
   */
  constructor( 
   private actions$: Actions,
   private mealEventSvc: MealEventService,
   private mealSvc: MealService,
   private foodAction: FoodActions
  ) {
    this.disablePersist = false;  
  } 
  
  private onSaveMeal( meal: Meal ) {
    if ( !this.disablePersist ) { this.mealSvc.save( meal ).subscribe(); }
    return this.foodAction.loadMealFoodItemsForMeal( meal ); 
    
    // Observable.of({ type: FoodActions.LOAD_MEALFOODITEMS_FOR_MEAL, payload: meal } );
  }
  
  private onLoadMealFoodItemsForMeal( meal: Meal ) {
     this.mealSvc.queryMealFoodItemsFor( meal ).subscribe();
     return Observable.of({type: 'NOOP-ONLOADMEALFOODITEMS', payload: meal } );
  }
  
  private onMealFoodItemsReceived( mealFoodItems: MealFoodItem[] ) {
    if ( mealFoodItems.length > 0 ) {
      this.mealSvc.validate(mealFoodItems[0].meal).delay( 3000 ).subscribe();      
    }
    return Observable.of({type: 'NOOP-ONMEALFOODITEMSLOADED', payload: mealFoodItems } );
  }
    
  private onSaveMealFoodItem( mealFoodItem: MealFoodItem ) {
    if ( !this.disablePersist ) { 
      this.mealSvc.saveMealFoodItem( mealFoodItem ).first().subscribe( () => { 
        if ( mealFoodItem.foodItem && mealFoodItem.meal ) { 
          this.mealSvc.validate(mealFoodItem.meal).delay( 3000 ).subscribe(); 
        }}); 
    } 
    return Observable.of( { type: 'MEALFOODITEM_SAVED', payload: mealFoodItem });    
  }
  
  private onDeleteMealFoodItem( mealFoodItem: MealFoodItem ) {
    if ( !this.disablePersist ) { 
      this.mealSvc.deleteMealFoodItem( mealFoodItem.id ).subscribe(() => { 
        if ( mealFoodItem.foodItem && mealFoodItem.meal ) { 
          this.mealSvc.validate(mealFoodItem.meal).delay( 3000 ).subscribe(); 
        }}); 
    }
    return Observable.of( { type: 'MEALFOODITEM_DELETED', payload: mealFoodItem });
  }

}
