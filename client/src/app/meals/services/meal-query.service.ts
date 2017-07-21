import { AppState } from '../../app.state';
import { FoodComponent } from '../meal.interfaces';
import { foodItemsReceived, foodComponentsReceived } from '../meal.state';
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
  }

  queryFoodItems( component: FoodComponent ) {
    console.log( 'querying food items' );
    const params = new URLSearchParams();
    params.set( 'projection', 'foodItemsWithCategory' );
    return this.http.get( component._links.foodItems.href, { search: params } )
      .map( res => res.json() )
      .map( ({_embedded: {foodItem} })  => this.store.dispatch( foodItemsReceived( foodItem ) ) );
  }

  queryFoodCategories() {
    return this.http.get( '/api/foodComponents' )
      .map( res => res.json() )
      .map( ({_embedded: {foodComponents} })  => this.store.dispatch( foodComponentsReceived( foodComponents ) ) );
  };

}
