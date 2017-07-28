import { AppState } from '../../app.state';
import { FoodComponent, Meal } from '../meal.interfaces';
import { foodItemsReceived, foodComponentsReceived, mealsReceived, mealFoodItemsReceived } from '../meal.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MealQueryService {

  constructor( private store: Store<AppState>, private http: Http ) {
    this.loadData();
  }

  loadData() {
    this.queryFoodCategories().subscribe();
    this.queryMeals().subscribe();
  }

  queryFoodItemsForMeal( meal: Meal ) {
    console.log( 'querying food items for meal ' + meal.description );
    const url = meal._links.mealFoodItems.href + '?projection=mealFoodItemFull';
    return this.http.get( url )
      .map( res => res.json() )
      .map( ({_embedded: { mealFoodItems } } ) => this.store.dispatch( mealFoodItemsReceived( mealFoodItems ) ) );
  }

  queryFoodItems( component: FoodComponent ) {
    console.log( 'querying food items for ' + component.description );
    const params = new URLSearchParams();
    params.set( 'projection', 'foodComponentFull' );
    params.set( 'page', '0' );
    params.set( 'size', '1000' );
    return this.http.get( component._links.foodItems.href, { search: params } )
      .map( res => res.json() )
      .map( ({_embedded: {foodItem} })  => this.store.dispatch( foodItemsReceived( { foodComponent: component, foodItems: foodItem } ) ) );
  }

  queryFoodCategories() {
    console.log( 'querying food components' );
    return this.http.get( '/api/foodComponent?projection=foodComponentFull&page=0&size=100' )
      .map( res => res.json() )
      .map( ({_embedded: {foodComponents} })  => this.store.dispatch( foodComponentsReceived( foodComponents ) ) );
  };

  queryMeals() {
    console.log( 'querying meals' );
    const params = new URLSearchParams();
    params.set( 'projection', 'mealFull' );
    return this.http.get( '/api/meal', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( mealsReceived( meals ) ) );
  };

}
