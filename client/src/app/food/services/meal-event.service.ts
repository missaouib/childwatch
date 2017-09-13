import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { Meal, MealEvent } from '../food.interfaces';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

@Injectable()
export class MealEventService {

  /**
   * @constructor
   */
  constructor(
    private store: Store<AppState>,
    private http: Http,
    private actions: FoodActions
  ) { }

  /**
   * Query for menu items between two dates (inclusive)
   */
  queryBetween(start: Date, end: Date) {
    const params = new URLSearchParams();
    params.append( 'projection', 'mealEventFull' );
    params.append( 'start', moment( start ).format( 'MM/DD/YYYY' ) );
    params.append( 'end', moment(end).format( 'MM/DD/YYYY' ) );

    return this.http.get( '/api/mealEvent/search/between', {search: params} )
      .map( res => res.json() )
      .map( ({_embedded: {menus} }) => this.store.dispatch( this.actions.mealEventsReceived( { start: start, end: end, menus: menus } ) ) );
  }
  
  updateMealEvent( mealEvent: MealEvent ) {
    console.log( mealEvent );
  }
  
}
