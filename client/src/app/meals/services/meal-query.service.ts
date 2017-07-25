import { AppState } from '../../app.state';
import { FoodComponent } from '../meal.interfaces';
import { foodItemsReceived, foodComponentsReceived, mealsReceived } from '../meal.state';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';


@Injectable()
export class MealQueryService {

  constructor( private store: Store<AppState>, private http: Http ) {
    this.loadData();
  }

  loadData() {
    this.queryFoodCategories().subscribe();
    this.queryMeals().subscribe();
  }

  queryFoodItems( component: FoodComponent ) {
    console.log( 'querying food items' );
    const params = new URLSearchParams();
    params.set( 'projection', 'foodItemsWithCategory' );
    return this.http.get( component._links.foodItems.href, { search: params } )
      .map( res => res.json() )
      .map( ({_embedded: {foodItem} })  => this.store.dispatch( foodItemsReceived( { foodComponent: component, foodItems: foodItem } ) ) );
  }

  queryFoodCategories() {
    console.log( 'querying food components' );
    const params = new URLSearchParams();
    params.set( 'projection', 'foodComponentWithFoodItems' );
    return this.http.get( '/api/foodComponent', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {foodComponents} })  => this.store.dispatch( foodComponentsReceived( foodComponents ) ) );
  };

  queryMeals(){
    const params = new URLSearchParams();
    params.set( 'projection', 'mealWithId' );
    return this.http.get( '/api/meal', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {meals} })  => this.store.dispatch( mealsReceived( meals ) ) );
  };

}
