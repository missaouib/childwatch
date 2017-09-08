/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { Meal, MealFoodItem } from '../food.interfaces';
import { FoodComponentService } from './food-component.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';


/**
 * MealService
 * 
 * @service
 */
@Injectable()
export class MealService {
  
  static FULL = 'mealFull';
  private URL = '/api/meal';

  /**
   * MealService constructor
   * 
   * @constructor
   * 
   * @param store
   * @param http
   * @param actions
   * @param foodComponentSvc
   */
  constructor( 
    private store: Store<AppState>, 
    private http: Http,
    private actions: FoodActions,
    private foodComponentSvc: FoodComponentService ) {
    Observable.merge( 
      this.foodComponentSvc.query(FoodComponentService.FULL ) 
    ).subscribe();
  }

  /**
   * Update the meal
   * 
   * @returns Observable<Response>
   */
  save( meal: Meal ) {
    return this.http.post( this.URL, meal );
  }
  
  /**
   * Add the meal food item to the given meal via REST call
   * 
   * @returns Observable<Response>
   */
  saveMealFoodItem( mealFoodItem: MealFoodItem ): Observable<Response> {       
    return this.http.post( '/api/mealFoodItem', {
      id: mealFoodItem.id,
      ageGroup: mealFoodItem.ageGroup,
      quantity: mealFoodItem.quantity,
      unit: mealFoodItem.unit,
      meal: (mealFoodItem.meal) ? '/api/meal/' + mealFoodItem.meal.id : undefined,
      foodItem: (mealFoodItem.foodItem) ? '/api/foodItem/' + mealFoodItem.foodItem.id : undefined       
    }).map( res => res.json() );
  }
  
  /**
   * Delete the meal food item
   */
  deleteMealFoodItem( mealFoodItemId: string ) {
    return this.http.delete( '/api/mealFoodItem/' + mealFoodItemId ).map( (res) => res.json() );
  }
  
  /**
   * Query for the mealFoodItems associated with the given meal id
   * 
   * @param id Meal id
   * 
   */
  queryMealFoodItemsFor( meal: Meal ): Observable<void> {
    const params = new URLSearchParams();
    params.set( 'mealId', meal.id );
    params.set( 'projection', 'mealFoodItemFull' );
    return this.http.get( '/api/mealFoodItem/search/findByMealId', { search: params} )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } }) => mealFoodItems )
      .map( ( m: MealFoodItem[] ) => {
        m.forEach( (mfi) => {
          mfi.foodComponent = mfi.foodItem ? mfi.foodItem.foodComponent : undefined;           
         console.log( 'for ' + mfi.id + ', setting foodComponent to ' + mfi.foodComponent );         
        } ); 
        this.store.dispatch( this.actions.mealFoodItemsReceived( m ) ); 
      });    
  }
   

  /**
   * Query for all meals
   * 
   * @returns Observable<Response>
   */
  query() {
    const params = new URLSearchParams();
    params.set( 'projection', MealService.FULL );
    
    return this.http.get( this.URL, {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( this.actions.mealsReceived( meals ) ) );
  }
  
  /**
   * Validate the meal
   */
  validate( meal: Meal ) {
    const params = new URLSearchParams();
    params.set( 'mealId', meal.id );
    
    return this.http.get( '/rules', {search: params } )
      .map( res => res.json() )
      .map( violations => this.store.dispatch( this.actions.mealViolationsReceived( violations ) ) );
  }
  
}
