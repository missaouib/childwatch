/*
 * REMARKABLE SYSTEMS CONFIDENTIAL
 * 
 * Copyright (c) 2017 Remarkable Systems, Incorporated.  
 * All Rights reserved
 */
import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { Meal } from '../food.interfaces';
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
  update( meal: Meal ) {
    return this.http.post( this.URL, meal );
  }
  
  /**
   * Add the meal food item to the given meal via REST call
   * 
   * @param id
   * @param ageGroup
   * @param quantity
   * @param unit
   * @param mealId
   * @param foodItemId
   * 
   * @returns Observable<Response>
   */
  addMealFoodItem( id: string, ageGroup: string, 
                   quantity: number, unit: string, mealId: string, foodItemId: string ): Observable<Response> {
    // create the meal food item    
    const URI = '/api/mealFoodItem';
    const mealFoodItem = {
      id: id,
      ageGroup: ageGroup,
      quantity: quantity,
      unit: unit,
      meal: (mealId) ? '/api/meal/' + mealId : undefined,
      foodItem: (foodItemId) ? '/api/foodItem/' + foodItemId : undefined       
    };
    
    console.log( 'Posting mealFoodItem' );
    
    return this.http.post( URI, mealFoodItem ).map( (res) => { 
        const response = res.json();
        console.log( response );
        return response;
      });          
  }
  
  deleteMealFoodItem( id: string ) {
    const URI = '/api/mealFoodItem/' + id;
    return this.http.delete( URI ).map( (res) => res.json() );
  }
  
  /**
   * Query for the mealFoodItems associated with the given meal id
   * 
   * @param id Meal id
   * 
   */
  mealFoodItemsFor( id: string ) {
    const params = new URLSearchParams();
    params.set( 'mealId', id );
    params.set( 'projection', 'mealFoodItemFull' );
    return this.http.get( '/api/mealFoodItem/search/findByMealId', { search: params} )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } }) => this.store.dispatch( this.actions.mealFoodItemsReceived( mealFoodItems ) ) );    
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
  
}
