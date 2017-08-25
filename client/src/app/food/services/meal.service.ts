import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { FoodComponentService } from './food-component.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';


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

  /*
  queryFoodItemsForMeal( meal: Meal ) {
    console.log( 'querying food items for meal ' + meal.description );
    const url = meal._links.mealFoodItems.href + '?projection=mealFoodItemFull';
    return this.http.get( url )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } } ) => this.store.dispatch( this.actions.mealFoodItemsReceived( mealFoodItems ) ) );
  }
   */




  query() {
    const params = new URLSearchParams();
    params.set( 'projection', MealService.FULL );
    
    return this.http.get( this.URL, {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( this.actions.mealsReceived( meals ) ) );
  };
  
}
