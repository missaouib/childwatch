import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { Meal, FoodItem } from '../food.interfaces';
import { FoodComponentService } from './food-component.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class MealService {
  
  static FULL = 'mealFull';
  private URL = '/api/meal';

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
   * Query for the mealFoodItems associated with the given meal
   */
  /*
  queryFoodItemsForMeal( meal: Meal ) {
    console.log( 'querying food items for meal ' + meal.description );
    const url = meal._links.mealFoodItems.href + '?projection=mealFoodItemFull';
    return this.http.get( url )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } } ) => this.store.dispatch( this.actions.mealFoodItemsReceived( mealFoodItems ) ) );
  }
   */


  update( meal: Meal ) {
    return this.http.post( this.URL, meal );
  }
  
  /**
   * Add the meal food item to the given meal
   */
  addMealFoodItem( id: string, ageGroup: string, quantity: number, unit: string, meal: Meal, foodItem: FoodItem ) {
    // create the meal food item    
    const URI = '/api/mealFoodItem';
    const mealFoodItem = {
      id: id,
      ageGroup: ageGroup,
      quantity: quantity,
      unit: unit,
      meal: (meal) ? '/api/meal/' + meal.id : undefined,
      foodItem: (foodItem) ? '/api/foodItem/' + foodItem.id : undefined       
    };
    
    return this.http.post( URI, mealFoodItem ).map( (res) => { 
        const response = res.json();
        console.log( response );
        return response;
      });          
  }
   

  /**
   * Query for all meals
   */
  query() {
    const params = new URLSearchParams();
    params.set( 'projection', MealService.FULL );
    
    return this.http.get( this.URL, {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( this.actions.mealsReceived( meals ) ) );
  };
  
}
