/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { FoodActions } from '../food.actions';
import { MealEventService } from './meal-event.service';
import { MealService } from './meal.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {UUID} from 'angular2-uuid';


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
  @Effect() mealUpdated = this.actions$
    .ofType( FoodActions.SAVE_MEAL )
    .map( toPayload )
    .switchMap( (payload) => this._mealUpdated(payload) );
  
  /**
   * 
   * @redux-effect
   */
  @Effect() mealFoodItemSaved = this.actions$
    .ofType( FoodActions.SAVE_MEALFOODITEM )
    .map( toPayload )
    .switchMap( (payload) => this._mealFoodItemSaved(payload) );
  
  @Effect() mealFoodItemsFor = this.actions$
    .ofType( FoodActions.MEALFOODITEMS_FOR )
    .map( toPayload )
    .switchMap( (payload) => { 
      const mealId = payload;
      this.mealSvc.mealFoodItemsFor( mealId ).subscribe();
      return Observable.of( { 
        type: 'NOOP-MEALFOODITEMS_returned',
        payload: mealId
      });
    });
  
  @Effect() mealFoodItemDeleted = this.actions$
    .ofType( FoodActions.DELETE_MEALFOODITEM )
    .map( toPayload )
    .switchMap( (payload) => this._mealFoodItemDeleted(payload) );
   
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
   private mealSvc: MealService
  ) {} 
  
  
  private _mealUpdated( payload: any ): Observable<Action> {
            const meal = {...payload };
        if ( !meal.id ) { meal.id = UUID.UUID(); }
        this.mealSvc.update( meal ).subscribe();
        return Observable.of({
          type: FoodActions.MEAL_UPDATED,
          payload: meal
        }); 
    
  }
  
  private _mealFoodItemSaved( payload: any ): Observable<Action> {
    const { id, ageGroup, quantity, unit, mealId, foodItemId } = payload;    
    this.mealSvc.addMealFoodItem( id || UUID.UUID(), ageGroup, quantity, unit, mealId, foodItemId ).subscribe();
    return Observable.of( {         
      type: FoodActions.MEALFOODITEM_UPDATED,
      payload: payload
    });    
  }
  
  private _mealFoodItemDeleted( payload: any ): Observable<Action> {
    const mealFoodItemId = payload;
    this.mealSvc.deleteMealFoodItem( mealFoodItemId ).subscribe();
    return Observable.of( { 
      type: "NOOP-MEALFOODITEM_deleted",
      payload: mealFoodItemId
    });
  }

}
