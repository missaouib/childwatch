import { AppState } from '../../app.state';
import { FoodComponent, Meal } from '../meal.interfaces';
import { MealActions } from '../meal.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import 'rxjs/add/operator/map';


@Injectable()
export class MealQueryService {

  constructor( 
    private store: Store<AppState>, 
    private http: Http,
    private mealActions: MealActions ) {
    Observable.merge( this.queryFoodCategories(), this.queryMeals() ).subscribe();
  }

  queryFoodItemsForMeal( meal: Meal ) {
    console.log( 'querying food items for meal ' + meal.description );
    const url = meal._links.mealFoodItems.href + '?projection=mealFoodItemFull';
    return this.http.get( url )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } } ) => this.store.dispatch( this.mealActions.mealFoodItemsReceived( mealFoodItems ) ) );
  }

  queryFoodItems( component: FoodComponent ) {
    console.log( 'querying food items for ' + component.description );
    const url = component._links.foodItems.href + '?projection=foodComponentFull&page=0&size=1000';
    return this.http.get( url )
      .map( res => res.json() )
      .map( ({_embedded: {foodItem} })  => 
        this.store.dispatch( this.mealActions.foodItemsReceived( { foodComponent: component, foodItems: foodItem } ) ) );
  }

  queryFoodCategories() {
    console.log( 'querying food components' );
    return this.http.get( '/api/foodComponent?projection=foodComponentFull&page=0&size=100' )
      .map( res => res.json() )
      .map( ({_embedded: {foodComponents} })  => this.store.dispatch( this.mealActions.foodComponentsReceived( foodComponents ) ) );
  };

  queryMeals() {
    const params = new URLSearchParams();
    params.set( 'projection', 'mealFull' );
    
    return this.http.get( '/api/meal', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( this.mealActions.mealsReceived( meals ) ) );
  };
  
  queryMenu(start: Date, end: Date) {
    return this.http.get( '/api/menu/search/between?project=menuFull&start=' +
                          moment( start ).format( 'MM/DD/YYYY' ) +
                          '&end=' + moment(end).format( 'MM/DD/YYYY' ) )
      .map( res => res.json() )
      .map( ({_embedded: {menus} }) => this.store.dispatch( this.mealActions.menusReceived( { start: start, end: end, menus: menus } ) ) );
  }
  

}
