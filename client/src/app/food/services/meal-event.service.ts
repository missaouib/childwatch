import { AppState } from '../../app.state';
import { FoodActions } from '../food.actions';
import { MealEvent } from '../food.interfaces';
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
      .map( ({_embedded: {mealEvent} }) => this.store.dispatch( this.actions.mealEventsReceived( { start: start, end: end, mealEvents: mealEvent } ) ) );
  }
  
  saveMealEvent( mealEvent: MealEvent ) {
    return this.http.post( '/api/mealEvent', 
      {
        id: mealEvent.id,
        startDate: mealEvent.startDate,
        endDate: mealEvent.endDate,
        meal: '/api/meal/' + mealEvent.meal.id,
        recurrence: 'NONE'
      });
  }
  
}
